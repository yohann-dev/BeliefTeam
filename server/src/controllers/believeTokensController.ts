import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { marketController } from './marketController';

export const believeTokensController = {
    async getBelieveTokens(req: Request, res: Response) {
        try {
            const { twitterHandle } = req.query;
            let tokens;
            
            if (twitterHandle) {
                // TODO: prevent from injection attack
                tokens = await db.collection('tokens').where('author', '==', twitterHandle).get() || [];
            } else {
                tokens = await db.collection('tokens').get() || [];
            }

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

            const isExist = await db.collection('tokens')
                .where('tokenAddress', '==', tokenAddress)
                .get();

            if (!isExist.docs.length) return res.status(404).json({ error: 'Token not found' });

            if (twitter_handle !== twitterHandle || isExist.docs[0].data().author !== twitter_handle) return res.status(401).json({ error: 'Unauthorized' });
        
            // TODO: prevent from injection attack
            await db.collection('tokens').doc(isExist.docs[0].id).update({
                needs,
                extraInfo,
                contactEmail,
                description,
                tweetLink,
            });

            return res.json({ message: 'Believe token needs added' });
        } catch (error: any) {
            console.error('Error creating believe token:', error);
            return res.status(500).json({ error: 'Failed to add believe token needs' });
        }
    }
}; 