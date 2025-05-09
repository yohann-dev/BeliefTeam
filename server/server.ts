import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import twitterRoutes from './src/routes/twitterRoutes';
import believeTokensRoutes from './src/routes/believeTokensRoutes';
import visitsRoutes from './src/routes/visitsRoutes';
import ideasRoutes from './src/routes/ideasRoutes';
import { env } from './src/config/env';

const app = express();

// Middleware
const corsOptions = {
    origin: env.NODE_ENV === 'production' 
        ? env.FRONTEND_ORIGIN
        : true,  // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/', twitterRoutes);
app.use('/', believeTokensRoutes);
app.use('/', visitsRoutes);
app.use('/', ideasRoutes);

// Start server
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
}); 