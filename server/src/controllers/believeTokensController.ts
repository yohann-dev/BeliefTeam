import { Request, Response } from 'express';
import { db } from '../../firebase';
import { marketController } from './marketController';
import { env } from '../config/env';
import { QuerySnapshot, DocumentData } from 'firebase-admin/firestore';
import { cacheService } from '../services/cacheService';
import admin from 'firebase-admin';

const DB_TOKEN_COLLECTION = env.NODE_ENV === 'production' ? 'tokens' : 'tokens_dev';
const BOOST_DURATION_DAYS = 3;

export const believeTokensController = {
    async getBelieveTokens(req: Request, res: Response) {
        try {
            const { twitterHandle } = req.query;
            let tokens: QuerySnapshot<DocumentData>;
            
            // Generate cache key based on query
            const cacheKey = twitterHandle ? `tokens_${twitterHandle}` : 'all_tokens';
            
            // Try to get from cache first
            const cachedTokens = cacheService.get<QuerySnapshot<DocumentData>>(cacheKey);
            if (cachedTokens) {
                console.log('Serving tokens from cache');
                const tokensMarketData = await marketController.getBelieveMarketData();
                return res.json(cachedTokens.docs.map(doc => ({
                    ...doc.data(),
                    marketData: tokensMarketData.get(doc.data().tokenAddress)
                })));
            }

            // If not in cache, fetch from database
            if (twitterHandle) {
                // TODO: prevent from injection attack
                tokens = await db.collection(DB_TOKEN_COLLECTION).where('author', '==', twitterHandle).get() || [];
            } else {
                tokens = await db.collection(DB_TOKEN_COLLECTION).get() || [];
            }

            // Store in cache
            cacheService.set(cacheKey, tokens);

            const tokensMarketData = await marketController.getBelieveMarketData();
            return res.json(tokens.docs.map(doc => ({
                ...doc.data(),
                marketData: tokensMarketData.get(doc.data().tokenAddress)
            })));
        } catch (error: any) {
            console.error('Error fetching believe tokens:', error);
            return res.status(500).json({ error: 'Failed to fetch believe tokens' });
        }
    },

    async addBelieveTokenNeeds(req: Request, res: Response) {
        try {
            const twitter_handle = req.cookies.twitter_handle;
            const { tokenAddress, tweetLink, twitterHandle, description, needs, extraInfo, contactEmail } = req.body;

            const isExist = await db.collection(DB_TOKEN_COLLECTION)
                .where('tokenAddress', '==', tokenAddress)
                .get();

            if (!isExist.docs.length) return res.status(404).json({ error: 'Token not found' });

            if (twitter_handle !== twitterHandle || isExist.docs[0].data().author !== twitter_handle) return res.status(401).json({ error: 'Unauthorized' });
        
            await db.collection(DB_TOKEN_COLLECTION).doc(isExist.docs[0].id).update({
                needs,
                extraInfo,
                contactEmail,
                description,
                tweetLink,
            });

            // Clear cache after update
            cacheService.clear();

            res.cookie('cookieName', 'value', {
                httpOnly: false,  // Set to true if you don't need JS access
                secure: process.env.NODE_ENV === 'production',  // true in production
                sameSite: 'lax',  // or 'strict' or 'none'
                path: '/',
                domain: new URL(env.FRONTEND_ORIGIN).hostname  // Extract domain from frontend URL
            });

            return res.json({ message: 'Believe token needs added' });
        } catch (error: any) {
            console.error('Error creating believe token:', error);
            return res.status(500).json({ error: 'Failed to add believe token needs' });
        }
    },

    async boostToken(req: Request, res: Response) {
        try {
            const { tokenId, transactionSignature } = req.body;

            if (!tokenId || !transactionSignature) {
                return res.status(400).json({ error: 'Token ID and transaction signature are required' });
            }

            const db = admin.firestore();
            const tokenRef = db.collection(DB_TOKEN_COLLECTION).doc(tokenId);

            // Calculate boost expiration
            const now = new Date();
            const expiresAt = new Date(now.getTime() + BOOST_DURATION_DAYS * 24 * 60 * 60 * 1000);

            // Update token with boost information


            await tokenRef.update({
                isBoosted: true,
                boostExpiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
                lastBoostSignature: transactionSignature,
                lastBoostAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error recording boost:', error);
            return res.status(500).json({ error: 'Failed to record boost' });
        }
    },

    async getBoostedTokens(req: Request, res: Response) {
        try {
            const db = admin.firestore();
            const tokens = await db.collection(DB_TOKEN_COLLECTION)
                .where('boostExpiresAt', '>', admin.firestore.Timestamp.now())
                .get();

            return res.status(200).json(tokens.docs.map(doc => doc.data()));
        } catch (error) {
            console.error('Error fetching boosted tokens:', error);
            return res.status(500).json({ error: 'Failed to fetch boosted tokens' });
        }
    }
    
};

const stats = cacheService.getStats();
console.log('Cache hit rate:', stats.hitRate); 