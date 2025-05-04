import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './router';
// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());

app.use('/', router);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 