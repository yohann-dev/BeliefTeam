import dotenv from 'dotenv';
dotenv.config();



export const env = {
    PORT: process.env.PORT || '3000',
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:3001',
    TWITTER_API_KEY: process.env.TWITTER_API_KEY!,
    TWITTER_API_SECRET_KEY: process.env.TWITTER_API_SECRET_KEY!,
    TWITTER_CALLBACK_URL: process.env.TWITTER_CALLBACK_URL!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT!,
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL!
}; 