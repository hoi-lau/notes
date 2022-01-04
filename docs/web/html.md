---
title: html
publish: false
date: 2020-09-17
---

## dom API

### 当前页面打开方式

performance.navigation.type

- 0. 当前页面是通过点击链接，书签和表单提交，或者脚本操作，或者在url中直接输入地址，type值为0 
- 1. 点击刷新页面按钮或者通过Location.reload()方法显示的页面，type值为1
- 2. 页面通过历史记录和前进后退访问时。type值为2
- 255. 任何其他方式，type值为255

