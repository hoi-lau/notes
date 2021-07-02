---
title: solidity 笔记
categories:
 - blockchain
date: 2020-06-30
tags:
 - solidity
 - blockchain
meta: 
 - name: description
   content: solidity 不完全指南
 - name: keywords
   content: solidity,以太坊,智能合约
---

> Solidity 是一门面向合约的、为实现智能合约而创建的高级编程语言, 运行于以太坊虚拟机EVM上. solidity官方文档 https://solidity.readthedocs.io

 Solidity 是一种静态类型语言.

## 版本声明

 为了避免未来被可能引入不兼容变更的编译器所编译, 每一个合约第一行应该指明合约版本.

如下表示编译器版本不得低于0.4.24.

```solidity
pragma solidity ^0.4.24;
```

## 常用类型

### bool

`true` or `false`. 默认值是`false`

### int/uint

8~256位 有符号/无符号 整型.

- int8 取值范围: `-128 ~ 127`
- uint8 取值范围: `0 ~ 255`. 依次类推

`int `默认为 `int256`, `uint` 默认为`uint256`

使用循环时注意变量的类型以及范围,防止死循环.以下就是一个死循环

```solidity
uint8 index = 0;
for (; index < 256; index++) {
  // do something
}
// 当index=255时, 由于uint8最大值为255, 255 + 1 会变成 0
```

### fixed/ufixed

 有符号和无符号的定长浮点型

### address

地址类型. 地址类型存储一个 20 字节的值（以太坊地址的大小）。 地址类型也有成员变量，并作为所有合约的基础 

`address.balance `: 此地址余额

`address.transfer`: 转账

### string

```solidity
string memory hash = "123";
```

### bytes

变长字节数组

```solidity
bytes memory b = new bytes(10);
// 创建了一个长度为10的字节数组
// b.length == 10
bytes memory str = bytes("123")
// 将字符串转为bytes
```



调用合约时可以获取`view`函数返回结果,但是无法获取`change state`类函数结果(异步),变通方法: 通过事件回调结果,或者

将结果存储在状态变量中,然后通过`view`函数获取

mapping`无法获取所有的`keys`

### function

可以将函数作为一种变量,有点像js. 分为内部函数和外部函数

使用内部函数

```solidity
pragma solidity ^0.4.24;

library ArrayUtils {
  // 内部函数可以在内部库函数中使用，
  // 因为它们会成为同一代码上下文的一部分
  function map(uint[] memory self, function (uint) pure returns (uint) f)
    internal
    pure
    returns (uint[] memory r)
  {
    r = new uint[](self.length);
    for (uint i = 0; i < self.length; i++) {
      r[i] = f(self[i]);
    }
  }
  function reduce(
    uint[] memory self,
    function (uint, uint) pure returns (uint) f
  )
    internal
    pure
    returns (uint r)
  {
    r = self[0];
    for (uint i = 1; i < self.length; i++) {
      r = f(r, self[i]);
    }
  }
  function range(uint length) internal pure returns (uint[] memory r) {
    r = new uint[](length);
    for (uint i = 0; i < r.length; i++) {
      r[i] = i;
    }
  }
}

contract Pyramid {
  using ArrayUtils for *;
  function pyramid(uint l) public pure returns (uint) {
    return ArrayUtils.range(l).map(square).reduce(sum);
  }
  function square(uint x) internal pure returns (uint) {
    return x * x;
  }
  function sum(uint x, uint y) internal pure returns (uint) {
    return x + y;
  }
}
```

使用外部函数:

```solidity
pragma solidity ^0.4.11;

contract Oracle {
  struct Request {
    bytes data;
    function(bytes memory) external callback;
  }
  Request[] requests;
  event NewRequest(uint);
  function query(bytes data, function(bytes memory) external callback) public {
    requests.push(Request(data, callback));
    NewRequest(requests.length - 1);
  }
  function reply(uint requestID, bytes response) public {
    // 这里要验证 reply 来自可信的源
    requests[requestID].callback(response);
  }
}

contract OracleUser {
  Oracle constant oracle = Oracle(0x1234567); // 已知的合约
  function buySomething() {
    oracle.query("USD", this.oracleResponse);
  }
  function oracleResponse(bytes response) public {
    require(msg.sender == address(oracle));
    // 使用数据
  }
}
```

#### 递归

`solidity` 调用栈最深为`1024`,尽量用循环

### 数组

 一个元素类型为 `T`，固定长度为 `k` 的数组可以声明为 `T[k]`，而动态数组声明为 `T[]` .

>  数组下标是从 0 开始的，且访问数组时的下标顺序与声明时相反 .
>
> T[0]代表最后一个元素

#### 成员

- **length**:

  数组有 `length` 成员变量表示当前数组的长度。 动态数组可以在 存储（storage） （而不是 内存（memory） ）中通过改变成员变量 `.length` 改变数组大小。 并不能通过访问超出当前数组长度的方式实现自动扩展数组的长度。 一经创建，内存（memory） 数组的大小就是固定的（但却是动态的，也就是说，它依赖于运行时的参数）。

- **push**:

  变长的 存储（storage） 数组以及 `bytes` 类型（而不是 `string` 类型）都有一个叫做 `push` 的成员函数，它用来附加新的元素到数组末尾。 这个函数将返回新的数组长度。

### mapping

类似`hash`表, 但是无法获取`key or value`的集合,可以自己实现.

`key `可以是除了映射、变长数组、合约、枚举以及结构体以外的几乎所有类型 .

```solidity
// address 映射到 uint
mapping(address => uint) public balances;
```

## 常用工具

### 字符串拼接

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

### uint转string

```solidity
function uint2str(uint i) internal pure returns (string) {
    if (i == 0) return "0";
    uint j = i;
    uint length;
    while (j != 0){
        length++;
        j /= 10;
    }
    bytes memory bstr = new bytes(length);
    uint k = length - 1;
    while (i != 0){
        bstr[k--] = byte(48 + i % 10);
        i /= 10;
    }
    return string(bstr);
}
```

### 固定长度的bytes转化为string

```solidity
function byte32ToString(bytes32 b) internal pure returns (string) {
    bytes memory ret = new bytes(b.length);
    for(uint i = 0; i < b.length; i++) {
    	ret[i] = b[i];
    }
    return string(ret);
}
```

## 编译合约

```sh
# 编译当前目录下TestContract.sol
docker run --rm -v $(pwd):/root ethereum/solc:0.4.24  --bin --hashes /root/TestContract.sol
```

