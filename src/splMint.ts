import {
  Connection, clusterApiUrl, LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getMint,
  getAccount,
} from '@solana/spl-token';
import { loadOrCreateKeypair } from './keypair';

async function ensureFunds(conn: Connection, lamportsNeeded = 0.5 * LAMPORTS_PER_SOL) {
  const kp = loadOrCreateKeypair();
  const bal = await conn.getBalance(kp.publicKey);
  if (bal < lamportsNeeded) {
    console.log('Airdropping 1 SOL for fees…');
    const sig = await conn.requestAirdrop(kp.publicKey, 1 * LAMPORTS_PER_SOL);
    await conn.confirmTransaction(sig, 'confirmed');
  }
}

async function main() {
  const conn = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const payer = loadOrCreateKeypair();
  await ensureFunds(conn);

  // choose decimals for your token (6 is common)
  const decimals = 6;

  console.log('Creating mint…');
  const mint = await createMint(
    conn,
    payer,                 // payer
    payer.publicKey,       // mint authority
    null,                  // freeze authority (none)
    decimals
  );
  console.log('✅ Mint address:', mint.toBase58());

  console.log('Creating (or fetching) your ATA…');
  const ata = await getOrCreateAssociatedTokenAccount(
    conn,
    payer,
    mint,
    payer.publicKey
  );
  console.log('✅ ATA address:', ata.address.toBase58());

  // mint 100 tokens (respecting decimals)
  const amount = 100 * 10 ** decimals;

  console.log(`Minting ${100} tokens to your ATA…`);
  const sig = await mintTo(conn, payer, mint, ata.address, payer, amount);
  await conn.confirmTransaction(sig, 'confirmed');
  console.log('✅ Mint tx:', sig);

  // Read back balances
  const mintInfo = await getMint(conn, mint);
  const ataInfo = await getAccount(conn, ata.address);
  const ui = Number(ataInfo.amount) / 10 ** mintInfo.decimals;

  console.log(`🎉 Done. You now hold ${ui} tokens of mint ${mint.toBase58()}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
