import { Request, Response } from 'express';
import axios from 'axios';
import { env } from '../config/env';
import { db } from '../../firebase';
import admin from 'firebase-admin';
import { MetricsService } from '../services/metrics.service';

const metricsService = new MetricsService();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;

async function fetchIdeas(ideaType?: string): Promise<string[]> {
    const promptText = `Give me a project idea for a motivated solopreneur to build. Could be related to crypto, but it should be a serious project. Format it as a tweet. Keep it under 280 characters. Catch attention. It could be a project that is related to ${ideaType}. Give also a token symbol and a name for the project. Don't include any other text than the idea. Don't abuse with emojis. Give first the token symbol and then the name of the project.`;

    try {
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: promptText
                    }
                ],
                temperature: 0.7,
                max_tokens: 280
            },
            {
                headers: {
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const generatedText = response.data.choices[0].message.content;

        await db.collection('ideas').doc().set({
            idea: generatedText,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return [generatedText];
    } catch (error) {
        console.error('Error generating ideas:', error);
        throw error;
    }
}

export const ideasController = {
    async generateIdea(req: Request, res: Response) {
        try {
            const { ideaType } = req.body;
            const ideas = await fetchIdeas(ideaType);

            await metricsService.incrementMetric('idea_generator');
            await db.collection('ideas').doc().set({
                idea: ideas[0],
                ideaType: ideaType,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.json(ideas);
        } catch (error) {
            console.error('Error generating ideas:', error);
            res.status(500).json({ error: 'Failed to generate ideas' });
        }
    }
};
