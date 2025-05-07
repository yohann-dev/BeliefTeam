import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

const app = initializeApp({
    credential: cert(serviceAccount as any)
});

export const db = getFirestore(app); 