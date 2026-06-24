# Bounty Rubric Checklist

This maps the Solana AI Kit skill bounty criteria to concrete files in this repository.

| Requirement | Status | Evidence |
| --- | --- | --- |
| Solves a real, recurring builder problem | Covered | [README.md](README.md), [DEMO.md](DEMO.md), [FORM_ANSWERS.md](FORM_ANSWERS.md) describe real production support tickets and replay workflows. |
| Novel gap | Covered | Focuses on post-transaction support and replay, distinct from generic ops, payments, tokenomics, signing safety, and code auditing. |
| Cross-domain usefulness | Covered | Connects support, wallet UX, RPC behavior, program logs, DeFi routes, testing, monitoring, and security/privacy. |
| Production-grade | Covered | Deterministic parser, fixtures, tests, installer, privacy guardrails, and no hidden network behavior. |
| Accurate and current | Covered | Uses Solana `getTransaction`, simulation logs, LiteSVM, Mollusk, Surfpool, Helius, Token-2022 awareness, wallet adapter concerns, and 2026 kit assumptions. |
| Progressive/token-efficient | Covered | [skill/SKILL.md](skill/SKILL.md) routes to focused markdown files and loads only what is needed. |
| Clear `SKILL.md` routing | Covered | [skill/SKILL.md](skill/SKILL.md) includes operating procedure, output contract, confidence levels, routing table, commands, and agents. |
| Good docs | Covered | [README.md](README.md), [DEMO.md](DEMO.md), [FORM_ANSWERS.md](FORM_ANSWERS.md), [RUBRIC_CHECKLIST.md](RUBRIC_CHECKLIST.md), and [LAUNCH_POST.md](LAUNCH_POST.md). |
| Working install path | Covered | [install.sh](install.sh), README install instructions, installer smoke-testable with `--target`. |
| MIT licensed | Covered | [LICENSE](LICENSE). |
| Ready to merge or submodule | Covered | Root repo shape matches the reference style: `skill/`, optional `agents/`, `commands/`, `rules/`, installer, README, tests. |

## Suggested Bounty PR Body

```markdown
Adds Solana Transaction Support Skill, a novel production-support and transaction-replay skill for Solana builders.

Standalone repo: https://github.com/Kohap/solana-transaction-support-skill
Submission packet: https://github.com/Kohap/solana-transaction-support-skill/blob/main/FORM_ANSWERS.md
Rubric checklist: https://github.com/Kohap/solana-transaction-support-skill/blob/main/RUBRIC_CHECKLIST.md
Demo: https://github.com/Kohap/solana-transaction-support-skill/blob/main/DEMO.md

What it solves:
- Helps teams diagnose failed or confusing Solana transactions from signatures, getTransaction JSON, simulation logs, and support tickets.
- Produces customer-safe replies, engineering tickets, replay plans, and monitoring follow-ups.
- Turns recurring support tickets into regression tests and production telemetry.

Why it fits the bounty:
- MIT licensed and follows the `skill/SKILL.md` progressive router pattern.
- Includes focused docs, optional agents, commands, rules, installer, deterministic parser, fixtures, and tests.
- Complements existing Solana development, ops, DeFi, Helius, QA, and security skills by focusing on the post-transaction support lifecycle.

Validation:
- `npm test`: PASS
- `npm run lint:shell`: PASS
```
