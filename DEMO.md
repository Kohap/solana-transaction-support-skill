# End-To-End Demo

This demo shows how an agent should use Solana Transaction Support Skill on a realistic production support case. Values are realistic placeholders, not customer data.

## User Prompt

```text
Users are reporting failed swaps. One user sent this transaction JSON from getTransaction.
Please explain what happened, draft a customer reply, and create an engineering reproduction plan.
```

## Progressive Loading Path

The agent starts at [skill/SKILL.md](skill/SKILL.md) and loads only the relevant files:

1. [skill/diagnosis.md](skill/diagnosis.md)
2. [skill/support.md](skill/support.md)
3. [skill/replay.md](skill/replay.md)
4. [skill/monitoring.md](skill/monitoring.md)

It does not load unrelated privacy or intake guidance unless the report contains user screenshots, private data, or missing facts.

## Evidence Input

The fixture at [tests/fixtures/failed-custom-error.json](tests/fixtures/failed-custom-error.json) represents a landed failed transaction with:

- `meta.err`: instruction 2 failed with custom error 6001.
- Anchor logs: `SlippageExceeded`.
- Runtime log: `custom program error: 0x1771`.
- Compute use: 190,482 of 200,000 units.
- Fee charged: 5,000 lamports.

## Deterministic Parser Output

Run:

```bash
node skill/scripts/summarize-transaction.mjs tests/fixtures/failed-custom-error.json
```

Expected classification:

```text
Class: slippage
Title: Quote expired or slippage check failed
Confidence: high
Anchor code: SlippageExceeded
Customer-safe explanation: quote or market conditions changed before execution
```

## Expected Agent Output

```markdown
## Case Summary

The transaction landed on Solana but failed during swap execution. High confidence: the swap program rejected the trade because slippage tolerance was exceeded. The requested swap did not complete, but the normal network fee was charged.

## Evidence

- Error: `InstructionError[2].Custom(6001)`
- Program log: `Error Code: SlippageExceeded`
- Runtime log: `custom program error: 0x1771`
- Compute units: `190482`
- Fee: `5000` lamports

## Customer Reply

Thanks for sending the transaction. I checked it and it did land on Solana, but the swap failed because the market moved or the quote became stale before execution. The swap output was not taken, but Solana still charged the normal transaction fee. Please refresh the quote and retry with a fresh route.

## Engineering Ticket

Likely cause: stale quote or slippage guard triggered before execution.

Reproduction:
1. Rebuild the swap instruction with the same account order and slippage threshold.
2. Use a LiteSVM/Mollusk test for program-owned logic, or Surfpool/mainnet fork if live pool state is required.
3. Assert the old route fails with `SlippageExceeded`.
4. Refresh quote immediately before signing and assert the app either succeeds or gives a pre-wallet error.

Acceptance criteria:
- Quote age is logged.
- User-facing copy says the quote expired or slippage was exceeded.
- Monitoring tracks slippage failures by route, pool, mint, wallet, and quote age.
```

## What This Demonstrates

- The skill produces an evidence-backed answer from raw transaction metadata.
- The parser provides deterministic support-packet generation instead of relying only on free-form reasoning.
- The workflow bridges support, engineering, replay, and monitoring.
- The output is safe for users and useful for maintainers.
