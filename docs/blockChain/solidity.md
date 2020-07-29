---
title: solidity tips
categories:
 - block chain
tags:
 - solidity
 - 以太坊
publish: false
---

> Solidity 是一门面向合约的、为实现智能合约而创建的高级编程语言, 运行于以太坊虚拟机EVM上. solidity官方文档 https://solidity.readthedocs.io

1. 使用循环时注意范围,防止死循环.
2. 可以获取`view`函数返回结果,但是无法获取`change state`类函数结果(异步),变通方法: 通过事件回调结果,或者将结果存储在状态变量中,然后通过`view`函数获取

## 字符串拼接

原生并不支持字符串拼接,需要自己实现,思路: **将`string`转化为`bytes`**.

```solidity
function strConcat(string _a, string _b) internal pure returns (string){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    string memory ret = new string(_ba.length + _bb.length);
    bytes memory bret = bytes(ret);
    uint k = 0;
    for (uint256 i = 0; i < _ba.length; i++)bret[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) bret[k++] = _bb[i];
    return string(ret);
}
```

## 版本声明

 为了避免未来被可能引入不兼容变更的编译器所编译, 每一个合约第一行应该指明合约版本.

表示编译器版本不得低于0.4.24.

```solidity
pragma solidity ^0.4.24;
```