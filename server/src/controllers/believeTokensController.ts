import { Request, Response } from 'express';
import { db } from '../../firebase';
import { marketController } from './marketController';
import { env } from '../config/env';
import { QuerySnapshot, DocumentData } from 'firebase-admin/firestore';
import { cacheService } from '../services/cache.service';
import { MetricsService } from '../services/metrics.service';

const metricsService = new MetricsService();
const DB_TOKEN_COLLECTION = env.NODE_ENV === 'production' ? 'tokens' : 'tokens_dev';

export const believeTokensController = {
    async getBelieveTokens(req: Request, res: Response) {
        try {
            const { twitterHandle, founderCardPage } = req.query;
            let tokens: QuerySnapshot<DocumentData>;
            
            // Generate cache key based on query
            const cacheKey = 'all_tokens';
            // Try to get from cache first
            const cachedTokens = cacheService.get<QuerySnapshot<DocumentData>>(cacheKey);
            if (cachedTokens) {
                console.log('Serving tokens from cache');
                if (founderCardPage) {
                    await metricsService.incrementMetric('editFounderCard');
                    const filteredTokens = cachedTokens.docs.filter(doc => doc.data().author === twitterHandle);

                    // if there is a token for the founder, return it
                    if (filteredTokens.length) return res.json(filteredTokens.map(doc => doc.data()));

                    // if there is no token for the founder, return all tokens except with isFounderCard: true
                    return res.json(cachedTokens.docs.filter(doc => !doc.data().isFounderCard).map(doc => doc.data()));
                }

                const birdeyeMarketData = await marketController.getBirdEyeMarketData(cachedTokens.docs.map(doc => doc.data().tokenAddress));
                return res.json(cachedTokens.docs.map(doc => ({
                    ...doc.data(),
                    marketData: birdeyeMarketData.get(doc.data().tokenAddress)
                })));
            }

            // If not in cache, fetch from database
            if (twitterHandle) {
                // TODO: prevent from injection attack
                tokens = await db.collection(DB_TOKEN_COLLECTION).where('author', '==', twitterHandle).get();

                // if there is no token for the founder, return all tokens except with isFounderCard: true
                if (!tokens.docs.length) {
                    tokens = await db.collection(DB_TOKEN_COLLECTION).where('isMarketData', '==', true).get() || [];
                    cacheService.set(cacheKey, tokens);
                    
                    return res.json(tokens.docs.filter(doc => !doc.data().isFounderCard).map(doc => doc.data()));
                }
            } else {
                tokens = await db.collection(DB_TOKEN_COLLECTION).where('isMarketData', '==', true).get() || [];
                cacheService.set(cacheKey, tokens);
            }

            if (founderCardPage) {
                await metricsService.incrementMetric('editFounderCard');
                return res.json(tokens.docs.map(doc => doc.data()));
            } else {
                const birdeyeMarketData = await marketController.getBirdEyeMarketData(tokens.docs.map(doc => doc.data().tokenAddress));
                return res.json(tokens.docs.map(doc => ({
                    ...doc.data(),
                    marketData: birdeyeMarketData.get(doc.data().tokenAddress)
                })));
            }
        } catch (error: any) {
            console.error('Error fetching believe tokens:', error);
            return res.status(500).json({ error: 'Failed to fetch believe tokens' });
        }
    },

    async addBelieveTokenNeeds(req: Request, res: Response) {
        try {
            const twitter_handle = req.cookies.twitter_handle;
            const { tokenAddress, projectLink, twitterHandle, description, needs, extraInfo, contactEmail, roadmap, tokenLogo } = req.body;

            const isExist = await db.collection(DB_TOKEN_COLLECTION)
                .where('tokenAddress', '==', tokenAddress)
                .get();

            if (!isExist.docs.length) return res.status(404).json({ error: 'Token not found' });

            if (isExist.docs[0].data().isFounderCard && isExist.docs[0].data().author !== twitter_handle) return res.status(403).json({ error: 'Token already has a founder card' });

            if (twitterHandle !== twitter_handle) return res.status(401).json({ error: 'Unauthorized' });

            const isFounderCard = isExist.docs[0].data().author === twitter_handle;
        
            await db.collection(DB_TOKEN_COLLECTION).doc(isExist.docs[0].id).update({
                needs,
                extraInfo,
                contactEmail,
                description,
                projectLink,
                roadmap,
                tokenLogo,
                isFounderCard,
                editedBy: twitter_handle
            });

            await metricsService.incrementMetric('submittedFounderCard');

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

            const birdeyeMarketData = await marketController.getBirdEyeMarketData([token.docs[0].data().tokenAddress]);

            return res.json({
                ...token.docs[0].data(),
                marketData: birdeyeMarketData.get(token.docs[0].data().tokenAddress)
            });
        } catch (error: any) {
            console.error('Error fetching believe token:', error);
            return res.status(500).json({ error: 'Failed to fetch believe token' });
        }
    },

    async cleanTokensFromDB() {
        const tokens = await db.collection('tokens').where('isMarketData', '==', false).get();
        const birdeyeMarketData = await marketController.getBirdEyeMarketData(tokens.docs.map(doc => doc.data().tokenAddress));
        
        console.log(`Found ${tokens.docs.length} tokens to update marketData status`);
        const batchSize = 400;
        for (let i = 0; i < tokens.docs.length; i += batchSize) {
            const batch = db.batch();
            const batchTokens = tokens.docs.slice(i, i + batchSize);
            
            for (const token of batchTokens) {
                const tokenAddress = token.data().tokenAddress;
                const tokenRef = db.collection('tokens').doc(tokenAddress);
                batch.update(tokenRef, {
                    isMarketData: !!(birdeyeMarketData.get(tokenAddress))
                });
            }
            
            await batch.commit();
        }
        console.log('All marketData status updated');
    }
};

const stats = cacheService.getStats();
console.log('Cache hit rate:', stats.hitRate); 