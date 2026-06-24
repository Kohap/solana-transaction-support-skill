import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

test("summarizer classifies slippage custom error", () => {
  const output = execFileSync(
    process.execPath,
    ["skill/scripts/summarize-transaction.mjs", "tests/fixtures/failed-custom-error.json"],
    { encoding: "utf8" }
  );

  assert.match(output, /Solana Transaction Support Packet/);
  assert.match(output, /Class: slippage/);
  assert.match(output, /Anchor code: SlippageExceeded/);
  assert.match(output, /Customer-Safe Explanation/);
  assert.match(output, /Engineering Ticket Seed/);
});

test("summarizer classifies expired blockhash", () => {
  const output = execFileSync(
    process.execPath,
    ["skill/scripts/summarize-transaction.mjs", "tests/fixtures/expired-blockhash.json"],
    { encoding: "utf8" }
  );

  assert.match(output, /Class: expired-blockhash/);
  assert.match(output, /Expired or invalid blockhash/);
});

test("summarizer reports confirmed success", () => {
  const output = execFileSync(
    process.execPath,
    ["skill/scripts/summarize-transaction.mjs", "tests/fixtures/successful-transaction.json"],
    { encoding: "utf8" }
  );

  assert.match(output, /Status: succeeded/);
  assert.match(output, /Class: confirmed-success/);
  assert.match(output, /transaction succeeded on-chain/i);
});
