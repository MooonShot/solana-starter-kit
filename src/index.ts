import { loadOrCreateKeypair } from './keypair';
const kp = loadOrCreateKeypair();
console.log('Public key:', kp.publicKey.toBase58());
