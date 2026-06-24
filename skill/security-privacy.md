# Security And Privacy

Use this file before handling user reports that include wallet data, screenshots, logs, or incident indicators.

## Never Request

- Seed phrases.
- Private keys.
- Recovery phrases.
- Raw JWTs, session cookies, or OAuth tokens.
- Remote wallet control.
- "Test signatures" from a user's real wallet unless they initiate a normal transaction in the product.

## Redaction

For public reports:

- Keep transaction signatures public when needed.
- Shorten wallet addresses to first 4 and last 4 characters unless full address is necessary.
- Remove emails, IP addresses, device IDs, auth tokens, and support account IDs.
- Remove internal RPC URLs when they contain keys.

For private engineering tickets:

- Full public keys and signatures are acceptable.
- Secrets are not acceptable.
- Store only the minimum needed to reproduce and fix.

## Incident Escalation

Escalate immediately when evidence suggests:

- Unauthorized transfers.
- Compromised authority, multisig, deploy key, or upgrade authority.
- Repeated failures around withdrawals, claims, mints, redemptions, or liquidations.
- Unexpected program upgrade.
- Frontend injection, malicious RPC response, or DNS/CDN compromise.

When escalated, switch from support diagnosis to incident response. Preserve evidence, stop speculative public replies, and involve security owners.

## User Safety Copy

Include this line whenever asking for more data from a user:

```text
Please do not share your seed phrase, private key, recovery phrase, or wallet login details.
```
