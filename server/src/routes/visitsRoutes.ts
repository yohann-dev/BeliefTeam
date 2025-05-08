import { Request, Response } from 'express';
import { db } from '../../firebase';
import admin from 'firebase-admin';
import express from 'express';
import { env } from '../config/env';
const router = express.Router();

export const incrementVisit = async (req: Request, res: Response) => {
  try {
    if (env.NODE_ENV !== 'production') return res.status(200).send();


    const docRef = db.collection('metrics').doc('visits');
    await docRef.set({ count: admin.firestore.FieldValue.increment(1) }, { merge: true });
    res.status(200).send();
  } catch (err) {
    console.error('Error incrementing visits:', err);
    res.status(500).send({ error: 'Internal error' });
  }
};

router.get('/api/visit', incrementVisit);

export default router;