# Submission Packet

## Name

Solana Transaction Support Skill

## One-Liner

Diagnose failed or confusing Solana transactions and turn them into customer-safe replies, engineering tickets, replay plans, regression tests, and monitoring.

## Problem

Live Solana apps receive support tickets that are hard to triage:

- A swap fails but the user pays a network fee.
- A transaction succeeds on-chain but the UI still shows pending.
- A wallet rejects or closes before signing.
- A custom program error appears with no user-friendly explanation.
- A backend marks settlement failed even though an explorer shows a signature.

These cases span support, wallet UX, RPC state, transaction metadata, protocol logs, program errors, indexers, and regression testing. Most existing skills help build or audit; this skill helps teams operate the support loop after launch.

## What It Does

- Reads transaction signatures, `getTransaction` JSON, simulation logs, wallet complaints, and support tickets.
- Classifies failure modes with evidence and confidence.
- Produces support packets with status, logs, error class, programs, and customer-safe explanation.
- Guides replay through LiteSVM, Mollusk, Surfpool, local validator, frontend tests, or backend RPC tests.
- Creates engineering ticket seeds and monitoring follow-ups.
- Enforces privacy and key-safety guardrails.

## Why It Is Novel

Adjacent skills cover broad ops, payments, signing safety, tokenomics, security auditing, and program development. This skill is narrower and highly recurring: production transaction support and replay.

It answers: "A user sent this transaction. What happened, what do we tell them, how do we reproduce it, and how do we prevent it next time?"

## Repository Quality

- `skill/SKILL.md` is the progressive entry point.
- Focused markdown files cover intake, diagnosis, replay, support, monitoring, security/privacy, and resources.
- `skill/scripts/summarize-transaction.mjs` provides deterministic local parsing.
- Tests cover structure and three transaction classes: slippage/custom error, expired blockhash, and confirmed success.
- Installer supports personal Claude, project `.claude`, and `.agents` layouts.
- MIT licensed.
- No postinstall, no hidden network calls, no wallet signing, no private-key handling.

## Validation

```bash
npm test
npm run lint:shell
```

Expected:

```text
5 tests passing
install.sh syntax valid
```

## Submission Links

Replace these after publishing:

- Standalone repo: `https://github.com/YOUR_GITHUB_USERNAME/solana-transaction-support-skill`
- Bounty PR: `https://github.com/solanabr/skill-bounty/pull/<PR_NUMBER>`
