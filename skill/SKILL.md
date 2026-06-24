---
name: solana-transaction-support
description: Diagnose Solana transaction signatures, getTransaction JSON, simulation logs, wallet support tickets, and user complaints. Use when an agent needs to explain failed or confusing Solana transactions, classify errors, create customer-safe support replies, generate engineering tickets, plan LiteSVM/Mollusk/Surfpool replay tests, or add monitoring for recurring production failures.
---

# Solana Transaction Support

Turn a Solana transaction signature, RPC payload, simulation log, screenshot transcript, or support ticket into an evidence-backed answer and a reproducible engineering path.

This skill extends the Solana AI Kit by focusing on production support and transaction replay. Delegate core program implementation to `solana-dev-skill`, security review to the security/auditor skills, DeFi protocol specifics to the relevant protocol skill, and infra/RPC details to Helius or Cloudflare skills when those are available.

## Operating Procedure

1. Gather the minimum facts.
   - Signature, cluster, wallet, app route, approximate time, user-visible message, and raw `getTransaction` or simulation output if available.
   - If facts are missing, read [intake.md](intake.md).

2. Protect the user and the team.
   - Never request seed phrases, private keys, recovery phrases, raw auth tokens, or signing access.
   - Sanitize wallet addresses only when the user asks for public sharing. Keep full addresses in private engineering tickets when needed.
   - For safety rules, read [security-privacy.md](security-privacy.md).

3. Build an evidence packet.
   - Prefer raw transaction JSON from `getTransaction` with `encoding: "json"` or `jsonParsed` and `maxSupportedTransactionVersion: 0`.
   - If a JSON payload is present, run the bundled parser or inspect the same fields manually. In the standalone repo use `node skill/scripts/summarize-transaction.mjs <file>`. After installation use `node .claude/skills/solana-transaction-support/scripts/summarize-transaction.mjs <file>` or run `node scripts/summarize-transaction.mjs <file>` from the installed skill directory.
   - If only a signature is present, fetch transaction details through the user's configured RPC, Helius MCP, Solana RPC, explorer, or project logs.

4. Diagnose the failure.
   - Read [diagnosis.md](diagnosis.md) for classification, error taxonomy, and confidence scoring.
   - Separate wallet/client errors, RPC/indexing lag, transaction simulation errors, runtime/program errors, protocol constraints, and successful transactions with confusing UX.

5. Decide the next artifact.
   - Customer reply needed: read [support.md](support.md).
   - Reproduction or regression test needed: read [replay.md](replay.md).
   - Recurring issue or launch-readiness issue: read [monitoring.md](monitoring.md).
   - External docs or ecosystem links needed: read [resources.md](resources.md).

## Standard Output

For most requests, produce:

- **Case summary**: one paragraph with status, likely cause, and confidence.
- **Evidence**: signature, slot/time, error, relevant logs, programs invoked, balances or token deltas when useful.
- **Customer-safe reply**: plain language, no blame, no internal-only details.
- **Engineering ticket**: suspected component, reproduction steps, owner, suggested test, and acceptance criteria.
- **Replay plan**: LiteSVM, Mollusk, Surfpool, local validator, or "not replayable from available evidence" with the missing data.
- **Monitoring follow-up**: metric, alert, log field, or dashboard query if this can recur.

## Confidence Levels

- **High**: RPC metadata and logs directly identify the cause.
- **Medium**: logs strongly imply the cause but program-specific decoding is missing.
- **Low**: evidence is incomplete, contradictory, or based mostly on user-facing symptoms.

Never overstate root cause. Say what is known, what is inferred, and what would confirm it.

## Progressive Disclosure

| Need | Read |
| --- | --- |
| Missing transaction facts, messy support tickets, screenshot transcripts | [intake.md](intake.md) |
| Error classification, log interpretation, confidence scoring | [diagnosis.md](diagnosis.md) |
| Regression test or mainnet-fork reproduction plan | [replay.md](replay.md) |
| User-facing replies, support macros, engineering ticket templates | [support.md](support.md) |
| Alerts, dashboards, production prevention | [monitoring.md](monitoring.md) |
| Privacy, abuse, key safety, incident escalation | [security-privacy.md](security-privacy.md) |
| Official docs and ecosystem references | [resources.md](resources.md) |

## Commands

- `/tx-support`: diagnose a signature, JSON file, or support ticket.
- `/replay-tx`: produce a replay/regression plan from an evidence packet.

## Agents

- `transaction-support-engineer`: technical diagnosis, replay plans, and regression tests.
- `support-comms-writer`: customer-safe explanations and status updates.
