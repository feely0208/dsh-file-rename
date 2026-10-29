# 深鲸批量改名（@deepwhale-cn/dsh-file-rename）

按规则批量重命名：替换文字 / 加前缀 / 加后缀 / 批量编号。

## 安装

```bash
dsh plugin --profile web add @deepwhale-cn/dsh-file-rename
```

## 用法

```bash
dsh-file-rename --op replace --input ./下载 --from 旧 --to 新
dsh-file-rename --op number  --input ./照片 --to 照片 --start 1
dsh-file-rename --op prefix  --input ./合同 --to 2026-
# 预览满意后加 --apply 1 执行
```

默认只预览；不覆盖已有文件。
