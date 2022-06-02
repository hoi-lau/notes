---
title: JavaScript尾递归优化
date: 2022-06-01
categories:
 - JavaScript
tags:
 - ECMAScript

---

> es6中明确支持了尾调用(在**严格模式**中) https://262.ecma-international.org/6.0/#sec-tail-position-calls

## tail call(尾调用)

尾调用是指一个函数里的最后一个动作是返回一个函数的调用结果的情形.

```JavaScript
'use strict'

// 非尾递归 最后一条指令是add操作
function calc(n, count = 0) {
  if (n === 0) return count
  return n + calc(n - 1, count)
}
// 尾递归
function calc(count, total = 0) {
  if (count === 1) return total
  return calc(count - 1, total + count)
}

```

## 尾递归

尾递归是指在一个方法内部，return递归调用

一个函数发生调用时, 会将当前function frame置于栈顶, 函数返回时会将该frame从栈顶移除, 理论上来讲, 发生尾递归调用时栈的长度应该是一个常数. 

使用以下代码测试各宿主的支持情况

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>tail call test</title>
</head>
<body>
  <script>
    'use strict'
    function calc(count, total = 0) {
      if (count === 1) return total
      return calc(count - 1, total + count)
    }
    try {
      alert(calc(1000000))
    } catch (error) {
      alert(error)
    }
  </script>
</body>
</html>
```

### 结论

| 宿主  | 尾调用优化支持 |
| ------- | ---- |
| chrome  | ❌   |
| edge | ❌    |
| nodejs | ❌    |
| firefox | ❌    |
| safari  | ✅    |

可能由于优化后难以调试和搜集错误信息(栈帧不连续了),所以各大浏览器厂商忽略了.

尾递归是一个比较实用的功能, 可以避免递归时的栈溢出问题, 同时优化内存. 虽然es标准支持尾调用, 但实际上各大浏览器厂商并未实现.
