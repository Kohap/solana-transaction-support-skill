# Diagnosis

Use this file to classify failures and decide what evidence supports the answer.

## Fast Path

1. Read `meta.err`.
2. Read the last failed program log.
3. Read custom program error lines and Anchor error logs.
4. Compare pre/post SOL and token balances if the user disputes asset movement.
5. Check `computeUnitsConsumed`, compute budget instructions, and log lines mentioning consumed units.
6. Check whether the transaction is absent, present with error, or present with success.

## Transaction States

| State | Evidence | Typical answer |
| --- | --- | --- |
| Not found | `getTransaction` returns `null` | Signature may be wrong, not finalized, expired before landing, or RPC lacks history. Check status and cluster. |
| Landed with error | `meta.err` non-null | User paid fee, state changes rolled back except fees. Diagnose logs. |
| Landed success | `meta.err` null | On-chain execution succeeded. Investigate UX, balance expectations, indexing lag, wrong token account, or delayed backend. |
| Preflight failed | Wallet or RPC simulation error, no signature | Nothing landed. Diagnose client transaction construction. |
| User rejected | Wallet adapter reports rejection | No chain failure. Improve copy and retry UX. |

## Common Failure Classes

### Expired or invalid blockhash

Evidence:

- Logs or client error mention `Blockhash not found`, `blockhash expired`, or `TransactionExpiredBlockheightExceededError`.
- No landed transaction, or send path fails before confirmation.

Likely fixes:

- Fetch blockhash as late as possible.
- Rebuild and re-sign after expiry.
- Avoid long wallet approval windows.
- Track `lastValidBlockHeight`.

### Insufficient SOL or token balance

Evidence:

- Error text mentions insufficient funds, rent, or token amount.
- Pre-balances cannot cover fee, rent, ATA creation, or transfer amount.

Likely fixes:

- Preflight balance checks.
- Explain fee/rent separately from token amount.
- Create ATAs only when needed and show cost.

### Slippage or price movement

Evidence:

- Logs mention slippage, minimum output, quote expired, price impact, or a protocol custom error mapped to slippage.
- DeFi routes through Jupiter, Orca, Raydium, Meteora, Kamino, or Drift.

Likely fixes:

- Refresh quote immediately before signing.
- Shorten quote TTL.
- Show minimum received.
- Add retry with fresh route, not blind resend.

### Compute budget exceeded

Evidence:

- Logs mention compute exhaustion or max instruction count.
- `computeUnitsConsumed` is near budget.
- Failure follows new CPI path, extra accounts, or simulation-only gap.

Likely fixes:

- Add or tune compute budget instruction.
- Reduce CPI depth and account loading.
- Profile with LiteSVM/Mollusk and mainnet-like accounts.

### Account constraints or missing accounts

Evidence:

- Anchor logs mention constraint, owner, signer, mutability, seeds, or associated token account.
- Runtime errors mention account not found, incorrect owner, invalid account data, or account already in use.

Likely fixes:

- Validate PDA seeds and bumps.
- Create or fetch ATAs before instruction.
- Verify Token Program vs Token-2022 program IDs.
- Improve frontend account derivation and backend IDL sync.

### Custom program error

Evidence:

- Logs contain `custom program error: 0x...`.
- Anchor logs include error code, number, and message.

Likely fixes:

- Decode against the program IDL or source enum.
- Add the decoded message to support output.
- If decoding is unavailable, include raw hex and decimal code plus failing program ID.

### RPC or indexing lag

Evidence:

- Transaction succeeded on-chain but app or indexer does not reflect state.
- Different RPC providers disagree temporarily.
- Backend waits for processed/confirmed while UI expects finalized, or vice versa.

Likely fixes:

- Align commitment levels.
- Use WebSocket subscriptions or webhooks for settlement.
- Add retry/backoff and reconciliation jobs.

### Wallet UX or client construction

Evidence:

- No landed signature.
- Wallet adapter error occurs before signing or after simulation.
- Mobile-only issue, deep link return issue, or transaction version unsupported by wallet.

Likely fixes:

- Reduce transaction size or split instructions.
- Check address lookup table support.
- Improve wallet adapter error mapping.
- Add copy for user rejection vs app failure.

## Confidence Scoring

Use high confidence when:

- `meta.err` and logs directly identify the failing instruction.
- Anchor logs decode the exact error.
- Balance deltas confirm the user-visible outcome.

Use medium confidence when:

- The failure class is clear but program-specific decoding is missing.
- The transaction succeeded but the reported UI state needs external logs.

Use low confidence when:

- There is no signature or raw log.
- The report depends on screenshots or memory.
- Multiple independent failures are plausible.

## Output Rule

Do not stop at "transaction failed." Name the failing layer, show the evidence, explain user impact, and give the next engineering action.
