import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

const serviceAccount = JSON.parse(
  readFileSync(join(process.cwd(), './firebase-beliefteam.json'), 'utf-8')
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();