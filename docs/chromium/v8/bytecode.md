---
title: v8之字节码
date: 2022-04-28
categories:
 - chromium
tags:
 - v8
publish: false
---

完整指令集定义:

src/interpreter/bytecodes.h

| 指令  | 含义 |
| ---- | ---- |
|  Ldar | 加载数据到累加器 |
| LdaSmi [1] | 将1加载到累加器 |
|  Star r1 | 累加器中的值写入到r1寄存器 |
| Add r0 | 将累加器中的值与寄存器r0中的值进行加法运算,存到累加器中 |
| Sub r2 | 累加器中的值减去寄存器r2中的值,存到累加器中 |
| CallProperty0 r0, r1 | 类似于 r0.r1(),存到累加器中 |
| CallProperty1 r0, r1, r2 | 类似于 r0.r1(r2),存到累加器中 |
| LdaConstant [0] | 加载常量池中索引为0的值到累加器 |
| LdaNamedProperty r1, [1], [2] | 获取r1寄存器的属性值为常数池索引为1的值, 2代表函数的所谓反馈向量的索引。 反馈向量包含用于性能优化的运行时信息。 |
| return | 返回累加器的值 |
| LdaUndefined | 同理, 加载undefined到累加器 |
| CreateObjectLiteral [0], [0], #8 | 创建对象,存到累加器中 |