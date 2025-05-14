import { Request, Response } from 'express';
import { db } from '../../firebase';
import admin from 'firebase-admin';
import express from 'express';
import { env } from '../config/env';
const router = express.Router();
import { MetricsService } from '../services/metrics.service';

const metricsService = new MetricsService();

export const incrementVisit = async (req: Request, res: Response) => {
  try {
    if (env.NODE_ENV !== 'production') return res.status(200).send();

    await metricsService.incrementMetric('visits');

    res.status(200).send();
  } catch (err) {
    console.error('Error incrementing visits:', err);
    res.status(500).send({ error: 'Internal error' });
  }
};

router.get('/api/visit', incrementVisit);

export default router;