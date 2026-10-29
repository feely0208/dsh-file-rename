#!/bin/bash
set -uo pipefail
cd "$(dirname "$0")/.."
PASS=0; FAIL=0
ok(){ echo "  ✅ $1"; PASS=$((PASS+1)); }
bad(){ echo "  ❌ $1"; FAIL=$((FAIL+1)); }
T=$(mktemp -d)

mkdir -p "$T/d"; printf a > "$T/d/旧-甲.txt"; printf b > "$T/d/旧-乙.txt"
node bin/cli.mjs --op replace --input "$T/d" --from 旧 --to 新 >/dev/null
[ -f "$T/d/旧-甲.txt" ] && ok "预览不改文件" || bad "预览竟然改名了"
node bin/cli.mjs --op replace --input "$T/d" --from 旧 --to 新 --apply 1 >/dev/null
[ -f "$T/d/新-甲.txt" ] && ok "执行后改名成功" || bad "执行后未改名：$(ls "$T/d")"
node bin/cli.mjs --op number --input "$T/d" --to 文件 --start 1 --apply 1 >/dev/null
ls "$T/d" | grep -q "文件-001.txt" && ok "编号模式" || bad "编号模式失败：$(ls "$T/d")"

echo "  ────────────────────────────────────────"; echo "  通过 $PASS · 失败 $FAIL"; rm -rf "$T"; [ "$FAIL" -eq 0 ]
