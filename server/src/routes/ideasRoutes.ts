import express from 'express';
import { ideasController } from '../controllers/ideasController';

const router = express.Router();

router.post('/api/idea/generate', ideasController.generateIdea);

export default router;
