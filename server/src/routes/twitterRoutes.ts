import express from 'express';
import { twitterController } from '../controllers/twitterController';

const router = express.Router();

router.get('/api/twitter/login', twitterController.login);
router.get('/api/twitter/callback', twitterController.callback);
router.get('/api/twitter/session', twitterController.getSession);
router.get('/api/twitter/logout', twitterController.logout);

export default router; 