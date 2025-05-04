import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import twitterRoutes from './src/routes/twitterRoutes';
import believeTokensRoutes from './src/routes/believeTokensRoutes';
import { env } from './src/config/env';

const app = express();

// Middleware
app.use(cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/', twitterRoutes);
app.use('/', believeTokensRoutes);

// Start server
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
}); 