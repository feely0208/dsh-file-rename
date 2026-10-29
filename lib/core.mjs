import { existsSync, readdirSync, renameSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

export function run({ op = 'replace', input = '', from = '', to = '', start = '1', apply = '0' } = {}) {
  const dir = String(input || '').trim();
  if (!dir) return { ok: false, text: '请填写要重命名的目录' };
  if (!existsSync(dir)) return { ok: false, text: '目录不存在：' + dir };
  const names = readdirSync(dir).filter((n) => {
    if (n.startsWith('.')) return false;
    try { return statSync(join(dir, n)).isFile(); } catch { return false; }
  }).sort();
  if (!names.length) return { ok: false, text: '目录里没有文件' };
  const 执行 = String(apply) === '1' || apply === true;
  const 计划 = [];
  let i = Number(start) || 1;
  for (const n of names) {
    const ext = extname(n), base = n.slice(0, n.length - ext.length);
    let 新 = n;
    if (op === 'replace') { if (!from) return { ok: false, text: '替换模式需要 --from' }; 新 = n.split(from).join(to) + ''; }
    else if (op === 'prefix') 新 = to + n;
    else if (op === 'suffix') 新 = base + to + ext;
    else if (op === 'number') 新 = String(to || '文件') + '-' + String(i).padStart(3, '0') + ext;
    i += 1;
    if (新 !== n) 计划.push({ from: n, to: 新 });
  }
  if (!计划.length) return { ok: true, text: '没有文件需要重命名（规则没有命中）' };
  const 冲突 = 计划.filter((p) => existsSync(join(dir, p.to)) && !names.includes(p.to));
  const lines = [执行 ? '执行重命名' : '预览（未改动任何文件，加 apply=1 才执行）', '共 ' + 计划.length + ' 个：'];
  for (const p of 计划.slice(0, 100)) lines.push('  ' + p.from + '  →  ' + p.to);
  if (计划.length > 100) lines.push('  … 还有 ' + (计划.length - 100) + ' 个');
  if (冲突.length) { lines.push('', '⚠️ 目标已存在 ' + 冲突.length + ' 个，已跳过：' + 冲突.slice(0, 5).map((c) => c.to).join('、')); }
  if (执行) {
    let 成功 = 0, 失败 = 0;
    for (const p of 计划) {
      if (existsSync(join(dir, p.to))) { 失败 += 1; continue; }
      try { renameSync(join(dir, p.from), join(dir, p.to)); 成功 += 1; } catch { 失败 += 1; }
    }
    lines.push('', '完成：成功 ' + 成功 + '，跳过/失败 ' + 失败);
  }
  return { ok: true, text: lines.join('\n') };
}
