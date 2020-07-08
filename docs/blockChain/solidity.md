---
title: solidity
categories:
 - block chain
tags:
 - solidity
 - 以太坊
publish: false
---

> Solidity 是一门面向合约的、为实现智能合约而创建的高级编程语言 ,https://solidity-cn.readthedocs.io/zh/develop/index.html

## 类型

### 值类型

**这些类型的变量将始终按值来传递**

#### 布尔 

 `bool` ：可能的取值为字面常数值 `true` 和 `false` .

运算符：

- `!` （逻辑非）
- `&&` （逻辑与， "and" ）
- `||` （逻辑或， "or" ）
- `==` （等于）
- `!=` （不等于）

运算符 `||` 和 `&&` 都遵循同样的短路（ short-circuiting ）规则。就是说在表达式 `f(x) || g(y)` 中， 如果 `f(x)` 的值为 `true` ，那么 `g(y)` 就不会被执行，即使会出现一些副作用。

#### 整型

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