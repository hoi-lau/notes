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

非确定性有限自动机. 状态0输入a可能到状态0或者状态1, 所以是不确定的

下图对应正则: (a|b)*abb

![](https://img.imliuk.com/20220708145651.png)

### DFA

确定性有限自动机, 对于一个输入, 只有一条确定的路径.

下图对应正则: (a|b)*abb

![](https://img.imliuk.com/20220708150706.png)

在 `Mastering Regular Expressions` 一书中有关正则引擎的描述:

| Engine type | Programs |
| --- | --- |
| DFA |  awk (most versions), egrep (most versions), flex, lex, MySQL, Procmail |
| Traditional NFA | GNU Emacs, Java, grep (most versions), less, more, .NET languages,PCRE library, Perl, PHP (all three regex suites), Python, Ruby,sed (most versions), vi |
| POSIX NFA | mawk, Mortice Kern Systems’ utilities, GNU Emacs (when requested) |
| Hybrid NFA/DFA |  GNU awk, GNU grep/egrep, Tcl |

## 正则导向 VS 文本导向

NFA-正则导向, DFA引擎-文本导向(DFA会返回最长的正则匹配).
现在的正则表达式功能丰富, 不能总是高效地实现为自动机. 环视断言和反向引用很难作为 NFA 实现.大多数正则表达式引擎使用递归回溯.

### 正则导向

如果该引擎在某个位置匹配失败,它会**回溯**以尝试替代路径.路径按从左到右的顺序尝试.因此,即使稍后在另一条路径中有更长的匹配,它也会返回最左边的匹配.例如: 正则`set|SetValue`匹配字符串`setValue`, 得到的结果将是`set`

#### 贪婪匹配

NFA匹配模式默认是贪婪的,尽可能多的匹配字符串.

#### 非贪婪匹配

在限制符 (*, +, ?, {n}, {n,}, {n,m}) 后面时加?, 匹配模式是非贪婪的, 尽可能少的匹配字符串.对于字符串 "oooo",'o+?' 将匹配单个 "o",而 'o+' 将匹配所有 'o'.

#### 回溯



### 文本导向

该引擎会尝试正则表达式的所有路径,它将返回最长的匹配.例如: 正则`set|SetValue`匹配字符串`setValue`,得到的结果是`SetValue`.由于不会发生回溯,所以通常DFA引擎会更快.

