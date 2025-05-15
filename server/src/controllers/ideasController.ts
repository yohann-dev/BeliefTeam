import { Request, Response } from 'express';
import axios from 'axios';
import { env } from '../config/env';
import { db } from '../../firebase';
import admin from 'firebase-admin';
import { MetricsService } from '../services/metrics.service';

const metricsService = new MetricsService();

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = env.OPENAI_API_KEY;

async function fetchIdeasFromDeepSeek(ideaType?: string): Promise<string[]> {
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
                temperature: 1.5,
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

async function fetchIdeasFromOpenAI(ideaType?: string): Promise<string[]> {
    const promptText = `Give me a project idea for a motivated solopreneur to build. Could be related to crypto, but it should be a serious project. Format it as a tweet. Keep it under 280 characters. Catch attention. It could be a project that is related to ${ideaType}. Give also a token symbol and a name for the project. Don't include any other text than the idea. Don't abuse with emojis. Give first the token symbol and then the name of the project.`;

    console.log('Generating ideas with OpenAI...');
    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: promptText
                    }
                ],
                temperature: 1,
                max_tokens: 280
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('OpenAI idea generated');

        const generatedText = response.data.choices[0].message.content;

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
            const ideas = await fetchIdeasFromOpenAI(ideaType);

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
    },

    async getSavedIdeas(req: Request, res: Response) {
        try {
            const ideas = await db.collection('ideas').get();
            return res.json(ideas.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id
                };
            }));
        } catch (error) {
            console.error('Error fetching saved ideas:', error);
            res.status(500).json({ error: 'Failed to fetch saved ideas' });
        }
    },

    async boostIdea(req: Request, res: Response) {
        const ideaId = req.query.ideaId as string;

        await db.collection('ideas').doc(ideaId).update({
            boost: admin.firestore.FieldValue.increment(1)
        });
        return res.json({ message: 'Idea boosted' });
    }
};
