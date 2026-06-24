# Monitoring

Use this file when the same failure can recur or when the team is preparing for launch.

## Metrics To Add

Track by app action, wallet type, cluster, program, and route:

- Transaction build attempts.
- Wallet sign requests.
- Wallet rejections.
- Preflight simulation failures.
- Send failures.
- Landed successes.
- Landed runtime failures.
- Confirmation time by commitment.
- Read-after-write mismatch count.
- Quote age at signing.
- Compute units consumed.
- Custom error code frequency.

## Log Fields

Do not log secrets. Useful fields:

- Request ID.
- Public wallet address.
- Signature when available.
- Cluster and RPC provider family.
- App action and route.
- Transaction version and serialized size.
- Blockhash age and last valid block height.
- Quote ID, quote age, slippage bps, and route hash.
- Program IDs and instruction names.
- Wallet adapter name and normalized error code.

## Alerts

Create alerts for:

- Spike in landed failures for a specific instruction or program ID.
- Spike in custom program error code.
- Confirmation latency above threshold.
- Read-after-write mismatches after successful transactions.
- Quote age above threshold at signing.
- Wallet-specific rejection or simulation error spike.
- RPC provider disagreement or missing history.

## Dashboard Slices

Useful slices:

- Feature/action.
- Wallet adapter.
- Browser/mobile platform.
- RPC provider.
- Program ID.
- Error class.
- Token mint, pool, market, or route when relevant.

## Prevention Checklist

- Simulate before presenting the wallet when safe.
- Refresh quotes immediately before signing.
- Rebuild transactions after blockhash expiry.
- Use deterministic error mapping from program/IDL errors to UI copy.
- Keep a small set of synthetic transactions for monitoring critical flows.
- Reconcile successful signatures against backend/indexer state.
