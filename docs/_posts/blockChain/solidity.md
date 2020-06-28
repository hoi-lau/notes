---
title: solidity
category:
 - 区块链
tags:
 - solidity
 - 以太坊
---

> Solidity 是一门面向合约的、为实现智能合约而创建的高级编程语言 

https://solidity-cn.readthedocs.io/zh/develop/index.html

## 语法

简单的合约,存储一个数字:

```solidity
pragma solidity ^0.4.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
```

## 版本声明

表示编译器版本不得低于0.4.0

```solidity
pragma solidity ^0.4.0;
```