#!/usr/bin/env node
import { run } from '../lib/core.mjs';

const args = process.argv.slice(2);
const val = (k, d = '') => { const i = args.indexOf('--' + k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
if (!args.length || args.includes('--help')) {
  console.log(`dsh-file-rename —— 深鲸批量改名

用法：dsh-file-rename --op <replace,prefix,suffix,number> [参数]
参数：input,from,to,start,apply
示例：dsh-file-rename --op replace --input ./下载 --from 旧 --to 新`);
  process.exit(0);
}
const input = { op: val('op', 'replace') };
for (const k of ["input", "from", "to", "start", "apply"]) input[k] = val(k);
const r = await run(input);
if (!r.ok) { console.error('❌', r.text || '失败'); process.exit(1); }
console.log(r.text || '');
process.exit(0);
