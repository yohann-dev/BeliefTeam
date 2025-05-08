import { NextApiRequest, NextApiResponse } from 'next';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL;
const SUPPORT_WALLET = '7WTMAK8Jb7JszSMDWSCa7g4dWN2zhoYKTat7Y4PsssHd';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transaction, publicKey } = req.body;

    if (!transaction || !publicKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const connection = new Connection(HELIUS_RPC_URL!, 'confirmed');
    const supportWallet = new PublicKey(SUPPORT_WALLET);

    // Create transaction
    const newTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(publicKey),
        toPubkey: supportWallet,
        lamports: 0.1 * LAMPORTS_PER_SOL, // 0.1 SOL
      })
    );

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    newTransaction.recentBlockhash = blockhash;
    newTransaction.feePayer = new PublicKey(publicKey);

    // Serialize the transaction
    const serializedTransaction = newTransaction.serialize().toString('base64');

    return res.status(200).json({ 
      transaction: serializedTransaction,
      blockhash 
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to create transaction' 
    });
  }
} 