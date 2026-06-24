# Launch Post Draft

## Short Post

I built Solana Transaction Support Skill for the Solana AI Kit skill bounty.

It helps AI agents turn failed transaction signatures, `getTransaction` JSON, simulation logs, and wallet complaints into evidence-backed customer replies, engineering tickets, replay plans, and monitoring.

Repo: https://github.com/Kohap/solana-transaction-support-skill
PR: https://github.com/solanabr/skill-bounty/pull/35

## Thread Draft

1/ I built Solana Transaction Support Skill for the Solana AI Kit skill bounty.

It is for the messy production loop every Solana team hits: users send failed signatures, confusing wallet screenshots, or "why did I pay a fee?" tickets, and the team needs a clear answer fast.

2/ The problem:

Solana transaction support is cross-domain. A failed user action might be slippage, blockhash expiry, insufficient rent, wallet rejection, RPC lag, compute exhaustion, an account constraint, or a successful transaction with stale UI state.

3/ The skill gives agents a repeatable flow:

- collect safe evidence
- decode transaction metadata
- classify the failure
- draft a customer-safe reply
- create an engineering ticket
- plan a replay/regression test
- add monitoring

4/ It is progressive and token-efficient.

`skill/SKILL.md` routes only to focused files for intake, diagnosis, replay, support, monitoring, security/privacy, and resources.

5/ It includes:

- deterministic transaction summarizer
- tests and fixtures
- optional support/replay commands
- support and engineering agents
- privacy rules
- installer
- MIT license

6/ Built to complement the Solana AI Kit by handling the production support workflow after apps go live.

Repo: https://github.com/Kohap/solana-transaction-support-skill
Bounty PR: https://github.com/solanabr/skill-bounty/pull/35
