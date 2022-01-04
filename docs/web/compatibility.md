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

### input

#### dataset

dataset属性在Safari上不生效

```
// 
-webkit-appearance: button;
```

### 动画

#### 与overflow-hidden搭配时渲染异常

```css
@keyframes move {
  0% {
    z-index: 1;
  }
  100% {
    z-index: 2;
  }
}
```

