# Intake

Use this file when the user provides an incomplete support report or only a transaction signature.

## Minimum Fields

Collect what is available without blocking on every field:

- Transaction signature.
- Cluster: mainnet-beta, devnet, testnet, local validator, or fork.
- Wallet and platform: Phantom, Solflare, Backpack, mobile wallet adapter, embedded wallet, browser, OS.
- Product surface: route, feature, action, pool, mint, market, vault, or program.
- User-facing symptom: exact copy from UI when possible.
- Approximate time and timezone.
- Raw evidence: `getTransaction` JSON, simulation logs, client logs, backend trace ID, RPC provider, or screenshot transcript.

## Safe Follow-Up Questions

Ask only for information that materially changes the diagnosis:

- "Can you share the transaction signature?"
- "Was this on mainnet or devnet?"
- "Which wallet and device were you using?"
- "Did the wallet show a rejection, simulation error, or confirmed transaction?"
- "Can you share the exact error text shown by the app?"

Never ask for secret phrases, private keys, session tokens, or remote control of a wallet.

## Evidence Priority

Use this order:

1. RPC transaction metadata and logs.
2. Project backend logs tied to request ID or wallet.
3. Client telemetry and wallet adapter errors.
4. User screenshot or copied error text.
5. Explorer summaries.
6. User memory of the event.

When sources conflict, prefer chain data for on-chain outcomes and client telemetry for pre-signing or wallet-rejection outcomes.

## First Response Pattern

When the ticket is still incomplete:

```text
I can help trace this. Please send the transaction signature and tell me whether it was on mainnet or devnet. Do not share your seed phrase, private key, recovery phrase, or wallet login details.
```

If the user has already sent enough evidence, do not ask more questions. Diagnose with what you have and mark uncertainty.
