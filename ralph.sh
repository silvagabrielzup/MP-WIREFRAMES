#!/usr/bin/env bash
set -u
MAX_ITER=15
for i in $(seq 1 $MAX_ITER); do
  echo "════════ iter $i ════════"
  OUT=$(claude -p --dangerously-skip-permissions < PROMPT.md)
  echo "$OUT"
  if echo "$OUT" | grep -q "RALPH_DONE"; then echo "✓ done"; exit 0; fi
  if ! grep -q '^- \[ \]' PROGRESS.md; then echo "✓ PROGRESS limpo"; exit 0; fi
  sleep 2
done
echo "⚠ atingiu MAX_ITER"