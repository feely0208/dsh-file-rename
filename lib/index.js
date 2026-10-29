import { createPlugin, pkgRootFrom } from '@deepwhale-cn/dsh-guard-core/plugin';
import { registerApi } from './api.js';

const base = createPlugin({
  name: 'file-rename',
  pkgRoot: pkgRootFrom(import.meta.url),
  skillFile: 'skill/file-rename.md',
  binFile: 'bin/cli.mjs',
  description: '深鲸批量改名：按替换/前缀/后缀/编号规则批量重命名文件，先预览再执行，不覆盖',
  whenToUse: '当用户要批量改文件名时使用：替换文字、加前缀后缀、批量编号。默认预览，apply=1 才执行。',
});
export const name = base.name;
export const inject = [...base.inject, 'webServer'];
export function apply(ctx) {
  base.apply(ctx);
  try { if (ctx.webServer?.register) registerApi(ctx); } catch (e) { ctx.logger?.warn?.('[file-rename] 面板出口注册失败: ' + (e?.message || e)); }
}
