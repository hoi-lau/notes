---
title: 正则优化
date: 2021-10-21
categories:
 - util
tags: 
 - regex
publish: false
---

## 正则匹配原理

正则引擎的实现主要分为`DFA` 和 `NFA`:

### NFA

非确定性有限自动机, 状态0输入a可能到状态0或者状态1, 所以是不确定的

下图对应正则: (a|b)*abb

![](https://img.imliuk.com/20220708145651.png)

### DFA

DFA是一种特殊的NFA.确定性有限自动机, 对于一个输入, 所以是确定的

下图对应正则: (a|b)*abb

![](https://img.imliuk.com/20220708150706.png)

在 `Mastering Regular Expressions` 一书中有关正则引擎的描述:

| Engine type | Programs |
| --- | --- |
| DFA |  awk (most versions), egrep (most versions), flex, lex, MySQL, Procmail |
| Traditional NFA | GNU Emacs, Java, grep (most versions), less, more, .NET languages,PCRE library, Perl, PHP (all three regex suites), Python, Ruby,sed (most versions), vi |
| POSIX NFA | mawk, Mortice Kern Systems’ utilities, GNU Emacs (when requested) |
| Hybrid NFA/DFA |  GNU awk, GNU grep/egrep, Tcl |

### 测试引擎类型

正则`set|setV`匹配字符串`setValue`, NFA得到的结果将是`set`, DFA得到的结果是`setV`.

## 正则导向 VS 文本导向

NFA-正则导向, DFA引擎-文本导向(DFA会返回最长的正则匹配).
现在的正则表达式功能丰富, 不能总是高效地实现为自动机. 环视断言和反向引用很难作为 NFA 实现.大多数正则表达式引擎使用递归回溯.

### 