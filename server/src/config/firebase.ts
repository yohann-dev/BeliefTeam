import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as serviceAccount from '../../firebase-beliefteam.json';

const app = initializeApp({
    credential: cert(serviceAccount as any)
});

export const db = getFirestore(app); 