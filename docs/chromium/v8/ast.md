---
title: v8之AST
date: 2022-04-28
categories:
 - chromium
tags:
 - v8
publish: false


---

要运行JavaScript代码,首先要对源代码进行处理

## scanner初始化

### 入口

```c++
// src/parsing/parser.cc: 545
scanner_.Initialize();
```

