import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});

// Export environment variables
export const env = {
    PORT: process.env.PORT || '3000',
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:3001',
    TWITTER_API_KEY: process.env.TWITTER_API_KEY!,
    TWITTER_API_SECRET_KEY: process.env.TWITTER_API_SECRET_KEY!,
    TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL!,
    NODE_ENV: process.env.NODE_ENV || 'development'
}; 