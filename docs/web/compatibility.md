---
title: web兼容性问题收集
date: 2021-09-07
publish: false
categories:
 - web
tags:
 - 兼容性
---

## IOS

### active伪类不生效

 >在iOS系统的移动设备中，需要在按钮元素或body/html上绑定一个touchstart事件才能激活:active状态。

### 解决办法

```js
// 绑定一个空函数
document.body.addEventListener('touchstart', function () {});
```

