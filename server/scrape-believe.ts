#!/usr/bin/env ts-node
import { config } from 'dotenv';
config({ path: '.env.local' });
import admin from "firebase-admin";
import { fetchBelieveReplies, ReplyInfo } from "../lib/twitter";
import { extractMintFromUrl } from "../lib/utils";

async function main() {
  // 1) Init Firestore Admin
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
  const db = admin.firestore();

  // 2) Fetch & parse replies
  const replies: ReplyInfo[] = await fetchBelieveReplies();
  const map = new Map<string, string>(); // mint -> earliest createdAt

  replies.forEach(({ url, createdAt }) => {
    const mint = extractMintFromUrl(url);
    if (!mint) return;
    if (!map.has(mint) || createdAt < map.get(mint)!) {
      map.set(mint, createdAt);
    }
  });

  if (!map.size) {
    console.log("No new mints found.");
    return;
  }

  return;

  // 3) Batch upsert to Firestore
  const batch = db.batch();
  map.forEach((createdAt, mint) => {
    const doc = db.collection("believeTokens").doc(mint);
    batch.set(
      doc,
      {
        mintedAt: admin.firestore.Timestamp.fromDate(new Date(createdAt)),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
  await batch.commit();

  console.log(`Upserted ${map.size} tokens to Firestore.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
