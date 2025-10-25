import fs from 'fs';
import { Keypair } from '@solana/web3.js';

export function loadOrCreateKeypair(path = 'id.keypair.json'): Keypair {
  if (fs.existsSync(path)) {
    const secret = Uint8Array.from(JSON.parse(fs.readFileSync(path, 'utf-8')));
    return Keypair.fromSecretKey(secret);
  }
  const kp = Keypair.generate();
  fs.writeFileSync(path, JSON.stringify(Array.from(kp.secretKey)));
  console.log(`Created keypair at ${path} (public: ${kp.publicKey.toBase58()})`);
  return kp;
}
