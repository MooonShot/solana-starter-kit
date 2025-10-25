import {
  Connection, clusterApiUrl, Keypair,
  LAMPORTS_PER_SOL, SystemProgram, Transaction
} from '@solana/web3.js';
import { loadOrCreateKeypair } from './keypair';

async function main() {
  const conn = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const sender = loadOrCreateKeypair();
  const receiver = Keypair.generate().publicKey;

  const lamports = 0.01 * LAMPORTS_PER_SOL;

  const tx = new Transaction().add(SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver,
    lamports
  }));

  const sig = await conn.sendTransaction(tx, [sender]);
  await conn.confirmTransaction(sig, 'confirmed');

  const bal = await conn.getBalance(sender.publicKey);
  console.log('✅ Sent 0.01 SOL to', receiver.toBase58());
  console.log('Tx:', sig);
  console.log('Sender balance now:', bal / LAMPORTS_PER_SOL, 'SOL');
}
main().catch(console.error);
