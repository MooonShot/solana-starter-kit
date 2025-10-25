import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { loadOrCreateKeypair } from './keypair';

async function main() {
  const conn = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const kp = loadOrCreateKeypair();

  console.log('Requesting airdrop of 1 SOL to', kp.publicKey.toBase58());
  const sig = await conn.requestAirdrop(kp.publicKey, 1 * LAMPORTS_PER_SOL);
  await conn.confirmTransaction(sig, 'confirmed');

  const balance = await conn.getBalance(kp.publicKey);
  console.log(`✅ Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
}

main().catch(console.error);
