import express from 'express';
import { believeTokensController } from '../controllers/believeTokensController';

const router = express.Router();

router.get('/api/getBelieveTokens', believeTokensController.getBelieveTokens);
router.post('/api/addBelieveTokenNeeds', believeTokensController.addBelieveTokenNeeds);
router.get('/api/getBelieveToken', believeTokensController.getBelieveToken);

export default router; 