# Solana Transaction Support Skill

An AI skill for diagnosing Solana transaction failures, replaying hard-to-debug user reports, and turning support tickets into engineering fixes.

This is designed as an addon for the Solana AI Kit. It extends core Solana development, testing, security, and infra skills with a focused workflow for the messy production loop every team hits:

```
user complaint or tx signature
        |
        v
transaction evidence packet
        |
        v
customer-safe explanation + engineering reproduction
        |
        v
test, fix, monitor, and prevent recurrence
```

## Problem

Most Solana teams eventually get tickets like:

- "My swap failed but I paid a fee."
- "The app said success, but my token balance did not change."
- "The wallet popup disappeared."
- "This only fails on mobile."
- "We keep seeing custom program error 0x1771."

Those issues sit between support, wallet UX, RPC behavior, program logs, DeFi integration, and test reproduction. A general coding agent can inspect each piece, but it usually lacks a consistent workflow for moving from signature to root cause to a useful user reply and regression test.

## What This Skill Does

- Decodes Solana `getTransaction` JSON, simulation logs, signatures, and support tickets.
- Classifies common failure modes: custom program errors, slippage, insufficient funds, expired blockhashes, compute exhaustion, missing accounts, wallet rejection, RPC lag, and ambiguous success.
- Produces a transaction support packet with evidence, confidence, likely cause, user-safe explanation, and engineering next steps.
- Guides agents through replay planning with LiteSVM, Mollusk, Surfpool, local validator, or mainnet-fork workflows.
- Creates support replies, issue templates, monitoring suggestions, and regression-test plans.
- Enforces privacy and safety rules: no seed phrases, no signing, no private user data in tickets, no speculative blame without evidence.

## Repository Structure

```
solana-transaction-support-skill/
|-- README.md
|-- LICENSE
|-- SUBMISSION.md
|-- DEMO.md
|-- FORM_ANSWERS.md
|-- RUBRIC_CHECKLIST.md
|-- LAUNCH_POST.md
|-- install.sh
|-- package.json
|-- CLAUDE.md
|-- skill/
|   |-- SKILL.md
|   |-- agents/openai.yaml
|   |-- diagnosis.md
|   |-- intake.md
|   |-- monitoring.md
|   |-- replay.md
|   |-- resources.md
|   |-- security-privacy.md
|   |-- support.md
|   `-- scripts/
|       `-- summarize-transaction.mjs
|-- agents/
|   |-- support-comms-writer.md
|   `-- transaction-support-engineer.md
|-- commands/
|   |-- replay-tx.md
|   `-- tx-support.md
|-- rules/
|   `-- support-privacy.md
`-- tests/
    |-- fixtures/
    |   |-- expired-blockhash.json
    |   |-- failed-custom-error.json
    |   `-- successful-transaction.json
    |-- structure.test.mjs
    `-- summarize-transaction.test.mjs
```

## Installation

Install into your personal Claude skills directory:

```bash
./install.sh
```

Install into a project-scoped Solana AI Kit directory:

```bash
./install.sh --target ./.claude/skills
```

Install into an agent-compatible directory:

```bash
./install.sh --target ./.agents/skills
```

The installer copies the `skill/` folder to `solana-transaction-support` under the target directory. By default it also installs the optional `agents/`, `commands/`, and `rules/` folders next to the target `skills/` directory. Use `--skill-only` if you only want the skill package.

## Usage Examples

Ask your agent:

```text
Use solana-transaction-support to diagnose this failed transaction: <signature>. Create a support reply and an engineering reproduction plan.
```

```text
Use solana-transaction-support with this getTransaction JSON file. Tell me why users are seeing custom program error 0x1771.
```

```text
Use solana-transaction-support to turn this wallet complaint into a ticket, regression test plan, and monitoring alert.
```

## Local Tool

The bundled parser is optional but useful when you already have raw `getTransaction` JSON:

```bash
node skill/scripts/summarize-transaction.mjs tests/fixtures/failed-custom-error.json
```

After installing into a project, run the installed copy instead:

```bash
node .claude/skills/solana-transaction-support/scripts/summarize-transaction.mjs <transaction.json>
```

It emits a Markdown support packet that the agent can use as evidence.

## Validation

Run:

```bash
npm test
npm run lint:shell
```

This checks that the skill structure is complete and that the transaction summarizer classifies the sample failed transaction correctly.

## Fit With Solana AI Kit

This skill is intentionally progressive:

- `skill/SKILL.md` stays as the routing entry point.
- Detailed workflows live in focused markdown files.
- Deterministic parsing lives in `skill/scripts/`.
- Agents, commands, and rules are optional wrappers for kit-style workflows.

It complements Solana AI Kit areas already covered by core development, Helius, Surfpool, LiteSVM, QA, security, and frontend wallet UX skills.

## License

MIT
