# Replay And Regression

Use this file when the user wants a reproducible test, mainnet-fork investigation, or engineering fix from a failed transaction.

## Replay Decision Tree

| Situation | Best path |
| --- | --- |
| Pure program logic with known accounts | LiteSVM or Mollusk unit/integration test |
| Needs live protocol state, oracle price, or pool liquidity | Surfpool/mainnet fork first, then reduce to local fixture |
| Wallet/client construction issue | Frontend or wallet-adapter test with serialized transaction assertions |
| RPC/indexing issue | Backend integration test with mocked RPC responses and commitment transitions |
| Missing evidence | Build an evidence checklist before writing a test |

## Evidence To Extract

From transaction JSON:

- Signature, slot, block time, recent blockhash.
- Failing instruction index from `meta.err`.
- Top-level and inner instructions around that index.
- Account keys, writable/signing roles, loaded addresses.
- Pre/post SOL balances and token balances.
- Logs around the failing program.
- Compute units consumed and compute budget instructions.
- Program IDs and IDL version if available.

From app/backend logs:

- Quote, route, pool, mint, amount, slippage, fee, user public key.
- Request ID and RPC endpoint family.
- Wallet adapter error code.
- Serialized transaction size and version.
- Commitment used for send, confirm, and read-after-write.

## Replay Plan Template

```markdown
## Replay Plan

Goal:
- Reproduce <failure> from transaction <signature>.

Known evidence:
- Cluster:
- Slot/time:
- Failing instruction:
- Failing program:
- Error:
- Relevant logs:

Harness:
- LiteSVM/Mollusk/Surfpool/local-validator:
- Required accounts:
- Required programs:
- Required oracle/pool state:

Steps:
1. Create fixture accounts from the transaction and project state.
2. Rebuild the same instruction with the same account order.
3. Assert the current failure.
4. Apply the proposed fix.
5. Assert the intended success or intended preflight rejection.

Acceptance criteria:
- Test fails before the fix and passes after the fix.
- Customer-facing error copy is deterministic.
- Monitoring captures recurrence.
```

## LiteSVM/Mollusk Guidance

Use a local test when:

- The failure is in your own program.
- Required accounts can be built from fixtures.
- Oracle or pool state can be mocked without invalidating the bug.

Prefer assertions for:

- Exact custom error.
- Account owner, seeds, signer, mutability, and token program ID.
- Preflight guard preventing a bad transaction from reaching the wallet.
- Compute unit ceilings when performance is part of the bug.

## Surfpool/Mainnet-Fork Guidance

Use a fork when:

- The bug depends on live pool liquidity, oracle state, address lookup tables, or third-party programs.
- You need to inspect account state near the historical transaction.
- A local fixture would hide the real failure.

After confirming on a fork, reduce the scenario into a smaller test. Fork-only reproductions are useful for diagnosis but weaker as long-term regression tests.

## Non-Replayable Cases

Some cases cannot be replayed from a signature alone:

- The transaction never landed and no serialized transaction is available.
- The wallet rejected before signing.
- The issue is purely indexer lag with no retained backend logs.
- The failure depends on private backend state that was not logged.

In these cases, produce an instrumentation plan rather than pretending a replay exists.
