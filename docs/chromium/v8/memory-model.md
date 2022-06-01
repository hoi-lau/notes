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

![](https://img.imliuk.com/20220531111949.png)

## stack 

JavaScript是单线程的,所以一个v8进程只有一个调用栈.理论上来讲, 调用一个函数会将这个函数放到栈顶, 当函数返回时会从栈顶移除.

栈是存储静态数据的地方，包括function、function frame、基础类型的值和指针.

## heap

堆是存储动态数据的地方, 垃圾搜集只会发生在堆上.

1. new space
大多数的对象都会被分配在这里，这个区域很小但是垃圾回收比较频繁；
2. old space
这里只保存原始数据对象，这些对象没有指向其他对象的指针；
3. large object space
这里存放体积超越其他区大小的对象，每个对象有自己的内存，垃圾回收其不会移动大对象区；
4. code space
代码对象，会被分配在这里。唯一拥有执行权限的内存；
5. map/cell space
存放 Cell 和 Map，每个区域都是存放相同大小的元素，结构简单。

## gc(垃圾搜集)

垃圾搜集是v8中最重要的一部分