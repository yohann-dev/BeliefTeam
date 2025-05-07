import admin from 'firebase-admin';
import { env } from './src/config/env';

const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();