import express from 'express';
import { believeTokensController } from '../controllers/believeTokensController';

const router = express.Router();

router.get('/api/getBelieveTokens', believeTokensController.getBelieveTokens);
router.post('/api/addBelieveTokenNeeds', believeTokensController.addBelieveTokenNeeds);
router.post('/api/believeTokens/boost', believeTokensController.boostToken);
router.get('/api/projects/boosted', believeTokensController.getBoostedTokens);
export default router; 