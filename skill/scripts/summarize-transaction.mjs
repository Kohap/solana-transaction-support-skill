#!/usr/bin/env node
import { readFileSync } from "node:fs";

const inputPath = process.argv[2];
const input = inputPath ? readFileSync(inputPath, "utf8") : readFileSync(0, "utf8");
const parsed = JSON.parse(input);
const tx = parsed.result ?? parsed;
const meta = tx.meta ?? {};
const transaction = tx.transaction ?? {};
const message = transaction.message ?? {};
const logs = Array.isArray(meta.logMessages) ? meta.logMessages : [];

function stringify(value) {
  if (value === null || value === undefined) return "none";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function getSignature() {
  if (Array.isArray(transaction.signatures) && transaction.signatures[0]) {
    return transaction.signatures[0];
  }
  if (typeof tx.signature === "string") return tx.signature;
  return "unknown";
}

function normalizeAccountKey(key) {
  if (typeof key === "string") return key;
  if (key && typeof key.pubkey === "string") return key.pubkey;
  return String(key ?? "");
}

function collectProgramIds() {
  const fromLogs = logs
    .map((line) => line.match(/^Program ([1-9A-HJ-NP-Za-km-z]{32,44}) /)?.[1])
    .filter(Boolean);
  const fromKeys = Array.isArray(message.accountKeys)
    ? message.accountKeys.map(normalizeAccountKey)
    : [];
  return [...new Set([...fromLogs, ...fromKeys])].filter(Boolean).slice(0, 20);
}

function extractCustomError() {
  const joined = logs.join("\n");
  const hex = joined.match(/custom program error: (0x[0-9a-fA-F]+)/)?.[1];
  const anchor = joined.match(/Error Code: ([A-Za-z0-9_]+).*?Error Number: ([0-9]+).*?Error Message: ([^\n.]+(?:\.[^\n.]*)?)/s);
  if (!hex && !anchor) return null;
  return {
    hex: hex ?? null,
    decimal: hex ? Number.parseInt(hex, 16) : Number(anchor?.[2]),
    anchorCode: anchor?.[1] ?? null,
    anchorNumber: anchor ? Number(anchor[2]) : null,
    anchorMessage: anchor?.[3]?.trim() ?? null
  };
}

function classify() {
  const text = `${stringify(meta.err)}\n${logs.join("\n")}`.toLowerCase();
  const custom = extractCustomError();

  if (!meta.err && !logs.length) {
    return {
      id: "unknown-or-success",
      title: "No runtime error in provided payload",
      confidence: "low",
      reason: "The payload does not include meta.err or logs."
    };
  }

  if (!meta.err) {
    return {
      id: "confirmed-success",
      title: "Confirmed success",
      confidence: "high",
      reason: "meta.err is null, so the transaction succeeded on-chain."
    };
  }

  if (text.includes("blockhash not found") || text.includes("blockhash expired") || text.includes("transactionexpired")) {
    return {
      id: "expired-blockhash",
      title: "Expired or invalid blockhash",
      confidence: "high",
      reason: "The error text indicates the transaction used an expired or invalid recent blockhash."
    };
  }

  if (text.includes("insufficient funds") || text.includes("insufficient lamports") || text.includes("insufficient balance")) {
    return {
      id: "insufficient-balance",
      title: "Insufficient SOL or token balance",
      confidence: "high",
      reason: "The logs or error mention insufficient funds or balance."
    };
  }

  if (text.includes("computational budget exceeded") || text.includes("exceeded maximum number of instructions") || text.includes("compute budget")) {
    return {
      id: "compute-budget",
      title: "Compute budget exceeded or misconfigured",
      confidence: "medium",
      reason: "The logs mention compute budget or instruction limits."
    };
  }

  if (text.includes("slippage") || text.includes("minimum output") || text.includes("price impact")) {
    return {
      id: "slippage",
      title: "Quote expired or slippage check failed",
      confidence: custom?.anchorCode ? "high" : "medium",
      reason: custom?.anchorCode
        ? `Anchor reported ${custom.anchorCode} (${custom.anchorNumber}).`
        : "The logs mention slippage, minimum output, or price movement."
    };
  }

  if (text.includes("accountnotfound") || text.includes("could not find account") || text.includes("invalid account data")) {
    return {
      id: "missing-or-invalid-account",
      title: "Missing or invalid account",
      confidence: "medium",
      reason: "The logs indicate an account was missing or had invalid data."
    };
  }

  if (text.includes("incorrectprogramid") || (text.includes("owner") && text.includes("mismatch"))) {
    return {
      id: "account-owner-mismatch",
      title: "Account owner or token program mismatch",
      confidence: "medium",
      reason: "The logs indicate an owner, program ID, or account constraint mismatch."
    };
  }

  if (text.includes("signature verification failed")) {
    return {
      id: "signature-verification",
      title: "Signature verification failed",
      confidence: "high",
      reason: "The runtime reported signature verification failure."
    };
  }

  if (custom) {
    return {
      id: "custom-program-error",
      title: "Custom program error",
      confidence: custom.anchorCode ? "high" : "medium",
      reason: custom.anchorCode
        ? `Anchor reported ${custom.anchorCode} (${custom.anchorNumber}): ${custom.anchorMessage}`
        : `Runtime reported custom program error ${custom.hex} (${custom.decimal}).`
    };
  }

  return {
    id: "program-runtime-error",
    title: "Program runtime error",
    confidence: "medium",
    reason: "meta.err is non-null, but the exact failure class needs program-specific decoding."
  };
}

function tailLogs(count = 8) {
  return logs.slice(Math.max(0, logs.length - count));
}

function customerExplanation(classification) {
  if (classification.id === "confirmed-success") {
    return "The transaction succeeded on-chain. If the app still looks unchanged, the next check is UI refresh, indexing, or the expected token/account view.";
  }
  if (classification.id === "slippage") {
    return "The transaction failed because the quote or market conditions changed before execution. The requested swap/action did not complete, though the network fee was still charged.";
  }
  if (classification.id === "insufficient-balance") {
    return "The transaction failed because the wallet did not have enough available balance for the action plus network fees or rent.";
  }
  if (classification.id === "expired-blockhash") {
    return "The transaction expired before it could be confirmed. The app should rebuild the transaction and ask the wallet to sign a fresh one.";
  }
  if (classification.id === "compute-budget") {
    return "The transaction ran out of compute budget during execution, so the requested action did not complete.";
  }
  return "The transaction landed but failed during execution. The requested app action did not complete, though the normal network fee may still have been charged.";
}

const classification = classify();
const customError = extractCustomError();
const programs = collectProgramIds();
const signature = getSignature();
const status = meta.err ? "failed" : "succeeded";

const lines = [];
lines.push("# Solana Transaction Support Packet");
lines.push("");
lines.push(`- Signature: ${signature}`);
lines.push(`- Slot: ${tx.slot ?? "unknown"}`);
lines.push(`- Block time: ${tx.blockTime ?? "unknown"}`);
lines.push(`- Status: ${status}`);
lines.push(`- Error: ${stringify(meta.err)}`);
lines.push(`- Compute units consumed: ${meta.computeUnitsConsumed ?? "unknown"}`);
lines.push(`- Fee lamports: ${meta.fee ?? "unknown"}`);
lines.push("");
lines.push("## Classification");
lines.push("");
lines.push(`- Class: ${classification.id}`);
lines.push(`- Title: ${classification.title}`);
lines.push(`- Confidence: ${classification.confidence}`);
lines.push(`- Reason: ${classification.reason}`);

if (customError) {
  lines.push("");
  lines.push("## Custom Error");
  lines.push("");
  lines.push(`- Hex: ${customError.hex ?? "unknown"}`);
  lines.push(`- Decimal: ${customError.decimal ?? "unknown"}`);
  lines.push(`- Anchor code: ${customError.anchorCode ?? "unknown"}`);
  lines.push(`- Anchor message: ${customError.anchorMessage ?? "unknown"}`);
}

lines.push("");
lines.push("## Programs Seen");
lines.push("");
if (programs.length) {
  for (const program of programs) lines.push(`- ${program}`);
} else {
  lines.push("- none found");
}

lines.push("");
lines.push("## Relevant Logs");
lines.push("");
if (logs.length) {
  for (const log of tailLogs()) lines.push(`- ${log}`);
} else {
  lines.push("- no logs present");
}

lines.push("");
lines.push("## Customer-Safe Explanation");
lines.push("");
lines.push(customerExplanation(classification));

lines.push("");
lines.push("## Engineering Ticket Seed");
lines.push("");
lines.push(`- Suspected layer: ${classification.id}`);
lines.push("- Reproduction: rebuild the failing instruction with the same account order and relevant pre-state; prefer LiteSVM/Mollusk for program logic or Surfpool/mainnet fork for live protocol state.");
lines.push("- Acceptance criteria: add a regression test, improve user-facing error copy, and add monitoring for this class if it can recur.");

process.stdout.write(`${lines.join("\n")}\n`);
