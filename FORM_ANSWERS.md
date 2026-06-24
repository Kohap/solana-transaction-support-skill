# Bounty Form Answers

Use these answers for the bounty submission form.

## Link To Your Submission

Standalone repo:

```text
https://github.com/Kohap/solana-transaction-support-skill
```

Bounty PR:

```text
https://github.com/solanabr/skill-bounty/pull/35
```

## Tweet Link

Optional. Use the final X post URL after publishing the launch post in [LAUNCH_POST.md](LAUNCH_POST.md).

## Did You Contribute Towards Existing Repos Or Is It A New Idea?

New idea. Solana Transaction Support Skill focuses on the production support loop after a dapp is live: users send failed transaction signatures, wallet complaints, screenshots, or confusing success reports, and teams need to turn them into evidence-backed replies, engineering tickets, replay tests, and monitoring.

It is submitted as a standalone MIT-licensed repo and as a PR to `solanabr/skill-bounty`.

## What Is Your Closest Competing Skill?

The closest adjacent skills are:

- Solana Ops Skill, which focuses on broad production reliability and incidents.
- sign-safe, which focuses on pre-signing safety.
- Payment ops skills, which focus on payment acceptance and settlement.
- Core Solana development and QA skills, which help build and test programs.

This skill is different because it focuses specifically on post-transaction support and replay: signature to diagnosis, customer-safe reply, engineering reproduction, regression test, and monitoring. It is not a general ops runbook, not a payment product design skill, and not a pre-signing security gate.

## Why Should This Skill Be Included In The Standard Kit?

Every live Solana product eventually gets support tickets like:

- "My swap failed but I paid a fee."
- "The wallet said success but the app still says pending."
- "The transaction confirmed but my token balance looks wrong."
- "This only fails on mobile."
- "What does custom program error 0x1771 mean?"

Without a structured workflow, teams bounce between support, engineering, wallet adapters, explorers, backend logs, RPC providers, and protocol docs. This skill gives agents a consistent production support lifecycle:

1. Intake safe evidence.
2. Decode or summarize the transaction.
3. Classify the failure.
4. Draft a customer-safe answer.
5. Create an engineering ticket.
6. Plan a replay/regression test.
7. Add monitoring so the issue is caught next time.

## Proof Of Quality

- Progressive `skill/SKILL.md` router.
- Focused docs for intake, diagnosis, replay, support, monitoring, security/privacy, and resources.
- Optional agents, commands, and privacy rules.
- Deterministic transaction summarizer in `skill/scripts/summarize-transaction.mjs`.
- Fixtures for slippage/custom error, expired blockhash, and confirmed success.
- Tests with Node's built-in test runner.
- MIT license.
- No postinstall, no hidden executables, no wallet signing, no private-key handling.

## Anything Else?

This skill complements the Solana AI Kit rather than duplicating it. It routes agents to existing core Solana, DeFi, Helius, QA, Surfpool, and security skills when those are the right tool, while keeping the support/replay workflow token-efficient and focused.
