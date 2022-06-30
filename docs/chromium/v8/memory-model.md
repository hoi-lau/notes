---
title: 「v8」内存管理
date: 2022-05-16
categories:
 - chromium
tags:
 - v8
publish: false
---

## v8内存结构

<!-- ![](https://img.imliuk.com/20220531111949.png) -->

## stack 

一个v8进程只有一个调用栈.理论上来讲, 调用一个函数会将这个函数放到栈顶, 当函数返回时会从栈顶移除.

栈是存储静态数据的地方，包括function、function frame、基础类型的值和指针.

## heap

堆是存储动态数据的地方, 垃圾搜集只会发生在堆上.

V8将堆内存分为大小固定的块,称为页(page),一页的大小通常是256K.heap分为以下几个部分

1. young generation
大多数的对象都会被分配在这里，这个区域很小但是垃圾回收比较频繁；
2. old generation
这里只保存原始数据对象，这些对象没有指向其他对象的指针；
3. large object space
这里存放大于kMaxRegularHeapObjectSize(128K) 的对象，每个对象有自己的内存，垃圾回收其不会移动大对象区；
<!-- 4. code space
代码对象，会被分配在这里。唯一拥有执行权限的内存；
5. map/cell space
存放 Cell 和 Map，每个区域都是存放相同大小的元素，结构简单。 -->

### young generation

young generation 分为两个连续的semispaces
#### semispace

semispace是一个连续的内存块, mark-compact 收集器使用from-space第一页内存来追踪活动对象
### old generation

分为两个部分

1. map space: 包含所有的map对象,其他的分配在old object space中

2. old object space

old generation使用标记-清除算法回收垃圾

## garbage collection(垃圾搜集)

垃圾搜集是v8中最重要的一部分,V8 实现了两种垃圾收集器：一种频繁收集young generation，另一种收集old generation

### Parallel Mark-Evacuate

![](https://img.imliuk.com/20220630151247.png)

该算法包括三个阶段

1. 标记
2. 复制
3. 更新指针

### Parallel Scavenger

Scavenger算法, 将new space分为大小相同的2部分(Semispace), 在同一时间两个Semispace只有一个处于使用状态，处于使用状态的Semispace称为From，未使用的Semispace则称为To。

![](https://img.imliuk.com/20220630151329.png)
