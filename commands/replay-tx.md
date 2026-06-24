# /replay-tx

Create a replay or regression-test plan for a Solana transaction failure.

## Arguments

- Transaction support packet, signature, raw transaction JSON, or failed simulation logs.
- Optional: program repo path, IDL path, target test harness.

## Workflow

1. Load `skill/SKILL.md`.
2. Read `skill/replay.md`.
3. Extract failing instruction, accounts, programs, balances, and logs.
4. Choose LiteSVM, Mollusk, Surfpool, local validator, frontend test, or backend RPC test.
5. Produce a minimal failing test plan and acceptance criteria.

## Output

Return a replay plan that can be implemented by the project agent or QA engineer.
