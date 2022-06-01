---
title: 「v8」指针压缩
date: 2022-05-16
categories:
 - chromium
tags:
 - v8
publish: false
---

## 什么是指针压缩

一个指针的大小取决于OS, cpu架构.在64位系统中,一个指针的大小为8字节. JavaScript应用程序使用的内存的很大一部分（约 70%）由此类引用组成。v8中的指针压缩将这些引用的大小减少到每个4字节,这显着减少了内存使用，代价是将 JavaScript 内存（“堆”）的大小限制为 4 GB.

为了减少内存占用,V8使用了指针压缩.想法很简单: 用32bit取代64bit指针.

> v8的指针压缩是可选的,通过编译时的参数控制

<a href="https://docs.google.com/document/d/10qh2-b4C5OtSg-xLwyZpEI5ZihVBPtn1xwKBbQC26yI/edit#">关于V8指针压缩的设计和一些实现细节</a>