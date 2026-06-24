# /tx-support

Diagnose a Solana transaction signature, `getTransaction` JSON file, simulation log, or user support ticket.

## Arguments

- Signature, JSON path, pasted logs, or ticket text.
- Optional: cluster, wallet, product feature, user-visible error, request ID.

## Workflow

1. Load `skill/SKILL.md`.
2. Use `skill/intake.md` if the report is incomplete.
3. If a JSON file is provided, run the bundled summarizer from the repo path (`node skill/scripts/summarize-transaction.mjs <file>`) or installed skill path (`node .claude/skills/solana-transaction-support/scripts/summarize-transaction.mjs <file>`).
4. Use `skill/diagnosis.md` to classify the issue.
5. Use `skill/support.md` to draft the customer reply and engineering ticket.
6. Use `skill/monitoring.md` if recurrence prevention is needed.

## Output

Return a transaction support packet, customer-safe reply, engineering ticket, and replay/monitoring next steps.
