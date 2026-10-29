# 深鲸批量改名（dsh-file-rename）

**什么时候用**：批量改文件名。

```bash
<cli> --op replace|prefix|suffix|number --input <目录> [--from 旧 --to 新] [--start 1] [--apply 1]
```

默认只预览；`--apply 1` 才执行；目标已存在会跳过，不覆盖。
