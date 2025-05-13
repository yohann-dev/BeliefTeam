import { Request, Response } from 'express';
import { db } from '../../firebase';
import { marketController } from './marketController';
import { env } from '../config/env';
import { QuerySnapshot, DocumentData } from 'firebase-admin/firestore';
import { cacheService } from '../services/cacheService';

const DB_TOKEN_COLLECTION = env.NODE_ENV === 'production' ? 'tokens' : 'tokens_dev';

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
                const birdeyeMarketData = await marketController.getBirdEyeMarketData(cachedTokens.docs.map(doc => doc.data().tokenAddress));
                return res.json(cachedTokens.docs.map(doc => ({
                    ...doc.data(),
                    marketData: birdeyeMarketData.get(doc.data().tokenAddress)
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

            const birdeyeMarketData = await marketController.getBirdEyeMarketData(tokens.docs.map(doc => doc.data().tokenAddress));
            return res.json(tokens.docs.map(doc => ({
                ...doc.data(),
                marketData: birdeyeMarketData.get(doc.data().tokenAddress)
            })));
        } catch (error: any) {
            console.error('Error fetching believe tokens:', error);
            return res.status(500).json({ error: 'Failed to fetch believe tokens' });
        }
    },

    async addBelieveTokenNeeds(req: Request, res: Response) {
        try {
            const twitter_handle = req.cookies.twitter_handle;
            const { tokenAddress, tweetLink, twitterHandle, description, needs, extraInfo, contactEmail, roadmap } = req.body;

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
                roadmap,
                isFounderCard: true
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

    async getBelieveToken(req: Request, res: Response) {
        try {
            const { tokenAddress } = req.query;
            const token = await db.collection(DB_TOKEN_COLLECTION).where('tokenAddress', '==', tokenAddress).get();
            if (!token.docs.length) return res.json([]);

            return res.json(token.docs[0].data());
        } catch (error: any) {
            console.error('Error fetching believe token:', error);
            return res.status(500).json({ error: 'Failed to fetch believe token' });
        }
    }
};

const stats = cacheService.getStats();
console.log('Cache hit rate:', stats.hitRate); 