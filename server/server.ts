import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import twitterRoutes from './src/routes/twitterRoutes';
import believeTokensRoutes from './src/routes/believeTokensRoutes';
import { env } from './src/config/env';

const app = express();

// Middleware
const corsOptions = {
    origin: env.NODE_ENV === 'production' 
        ? 'https://beliefteam.fun'
        : true,  // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

console.log('CORS options:', corsOptions);
app.use(cors(corsOptions));

// Cookie parser middleware
app.use(cookieParser());

// Debug middleware to log cookies and headers
app.use((req, res, next) => {
    console.log('Cookies received:', req.cookies);
    console.log('Request origin:', req.headers.origin);
    next();
});

app.use(express.json());

// Routes
app.use('/', twitterRoutes);
app.use('/', believeTokensRoutes);

// Start server
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
}); 