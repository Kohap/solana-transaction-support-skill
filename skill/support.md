# Support Responses

Use this file when the output needs to be read by a user, founder, support lead, or community manager.

## Tone

Be clear, calm, and specific. Avoid blaming the user, wallet, RPC provider, validator, or protocol unless the evidence is direct. Distinguish "your funds moved" from "the transaction fee was paid" from "nothing landed."

## Customer Reply Template

```text
Thanks for sending this. I checked the transaction and it did land on Solana, but it failed during execution. That means the network charged the normal transaction fee, but the requested app action did not complete.

What happened:
<plain-English cause>

What you need to do:
<retry, refresh quote, add SOL for fees/rent, wait for indexing, contact support, or no action>

What we are doing:
<engineering follow-up if this is our issue>
```

## Successful Transaction But Confusing UI

```text
The transaction itself succeeded on-chain. The confusing part appears to be the app's read-after-write state: the chain shows the action completed, but the UI or indexer did not update immediately. We are checking the refresh path and settlement tracking.
```

## Failed DeFi Quote

```text
The transaction failed because the market moved or the quote became stale before it was confirmed. No swap output was taken, but the network fee was still charged. Please refresh the quote and try again with a fresh route. We are checking whether the app should refresh quotes closer to signing.
```

## Insufficient Balance

```text
The transaction could not complete because the wallet did not have enough available balance for the action plus Solana fees and rent. Please keep a small SOL buffer for fees and account creation, then retry.
```

## Wallet Rejection

```text
This did not reach the chain. The wallet reported that the request was rejected or closed before signing, so no app action completed and no on-chain transaction fee should have been charged for this attempt.
```

## Engineering Ticket Template

```markdown
## Transaction Support Ticket

User symptom:

Evidence:
- Signature:
- Cluster:
- Slot/time:
- Error:
- Logs:
- Programs:

Likely cause:

Confidence:

Owner:

Reproduction plan:

Proposed fix:

Acceptance criteria:
- User-facing error message is clear.
- Regression test covers the failure.
- Monitoring catches recurrence.
```

## Public Incident Update Template

Use only when the issue affects multiple users or funds/access.

```text
We are investigating failed transactions affecting <feature>. Current evidence points to <known layer>, and we have not seen evidence of unauthorized fund movement. We will update this thread by <time>. Please do not share seed phrases or private keys with anyone.
```
