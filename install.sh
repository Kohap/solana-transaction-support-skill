#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/skill"
TARGET_DIR="$HOME/.claude/skills"
SKILL_NAME="solana-transaction-support"
ASSUME_YES=false
SKILL_ONLY=false

print_help() {
  cat <<'EOF'
Solana Transaction Support Skill installer

Usage:
  ./install.sh [options]

Options:
  --target PATH   Install into PATH instead of ~/.claude/skills
  --name NAME     Install under NAME instead of solana-transaction-support
  --skill-only    Install only the skill folder, not agents/commands/rules
  -y, --yes       Skip confirmation
  -h, --help      Show this help

Examples:
  ./install.sh
  ./install.sh --target ./.claude/skills
  ./install.sh --target ./.agents/skills --name solana-transaction-support
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      TARGET_DIR="${2:?Missing value for --target}"
      shift 2
      ;;
    --name)
      SKILL_NAME="${2:?Missing value for --name}"
      shift 2
      ;;
    -y|--yes)
      ASSUME_YES=true
      shift
      ;;
    --skill-only)
      SKILL_ONLY=true
      shift
      ;;
    -h|--help)
      print_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      print_help
      exit 1
      ;;
  esac
done

if [[ ! -f "$SOURCE_DIR/SKILL.md" ]]; then
  echo "Cannot find skill/SKILL.md next to installer." >&2
  exit 1
fi

DEST_DIR="$TARGET_DIR/$SKILL_NAME"
CONFIG_ROOT="$(dirname "$TARGET_DIR")"

echo "Solana Transaction Support Skill"
echo ""
echo "Source: $SOURCE_DIR"
echo "Target: $DEST_DIR"
if [[ "$SKILL_ONLY" != true ]]; then
  echo "Extras: $CONFIG_ROOT/agents, $CONFIG_ROOT/commands, $CONFIG_ROOT/rules"
fi
echo ""

if [[ "$ASSUME_YES" != true ]]; then
  read -r -p "Install? [Y/n] " reply
  case "$reply" in
    n|N|no|NO)
      echo "Installation cancelled."
      exit 0
      ;;
  esac
fi

mkdir -p "$TARGET_DIR"

if [[ -e "$DEST_DIR" ]]; then
  BACKUP_DIR="$DEST_DIR.backup.$(date +%Y%m%d%H%M%S)"
  mv "$DEST_DIR" "$BACKUP_DIR"
  echo "Existing install moved to $BACKUP_DIR"
fi

mkdir -p "$DEST_DIR"
cp -R "$SOURCE_DIR"/. "$DEST_DIR"/

if [[ "$SKILL_ONLY" != true ]]; then
  for extra in agents commands rules; do
    if [[ -d "$SCRIPT_DIR/$extra" ]]; then
      mkdir -p "$CONFIG_ROOT/$extra"
      cp -R "$SCRIPT_DIR/$extra"/. "$CONFIG_ROOT/$extra"/
    fi
  done
fi

echo ""
echo "Installed solana-transaction-support to $DEST_DIR"
if [[ "$SKILL_ONLY" != true ]]; then
  echo "Installed agents, commands, and rules under $CONFIG_ROOT"
fi
echo "Try: Use solana-transaction-support to diagnose this failed transaction: <signature>"
