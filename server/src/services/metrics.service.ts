import { db } from '../../firebase';
import admin from 'firebase-admin';
import { env } from '../config/env';

export class MetricsService {
    async getMetrics(key: string) {
        // if (env.NODE_ENV !== 'production') return;

        const metrics = await db.collection('metrics').doc(key).get();
        return metrics.data();
    }

    async incrementMetric(key: string) {
        // if (env.NODE_ENV !== 'production') return;

        await db.collection('metrics').doc(key).set({
            count: admin.firestore.FieldValue.increment(1)
        }, { merge: true }
    );
    }
}
