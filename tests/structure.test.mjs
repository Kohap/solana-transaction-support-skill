import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const requiredFiles = [
  "README.md",
  "LICENSE",
  "SUBMISSION.md",
  "DEMO.md",
  "FORM_ANSWERS.md",
  "RUBRIC_CHECKLIST.md",
  "LAUNCH_POST.md",
  "install.sh",
  "skill/SKILL.md",
  "skill/agents/openai.yaml",
  "skill/intake.md",
  "skill/diagnosis.md",
  "skill/replay.md",
  "skill/support.md",
  "skill/monitoring.md",
  "skill/security-privacy.md",
  "skill/resources.md",
  "skill/scripts/summarize-transaction.mjs",
  "agents/transaction-support-engineer.md",
  "agents/support-comms-writer.md",
  "commands/tx-support.md",
  "commands/replay-tx.md",
  "rules/support-privacy.md"
];

test("required skill files exist", () => {
  for (const file of requiredFiles) {
    assert.equal(existsSync(file), true, `${file} should exist`);
  }
});

test("SKILL.md has required frontmatter", () => {
  const skill = readFileSync("skill/SKILL.md", "utf8");
  assert.match(skill, /^---\nname: solana-transaction-support\n/m);
  assert.match(skill, /description: Diagnose Solana transaction signatures/);
});
