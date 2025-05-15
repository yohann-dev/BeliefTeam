import express from 'express';
import { ideasController } from '../controllers/ideasController';

const router = express.Router();

router.post('/api/idea/generate', ideasController.generateIdea);
router.get('/api/ideas/saved', ideasController.getSavedIdeas);
router.get('/api/idea/boost', ideasController.boostIdea);

export default router;
