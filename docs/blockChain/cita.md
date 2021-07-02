---
title: 国产开源区块链cita
date: 2020-05-20
categories:
 - blockchain
tags: 
 - cita
meta:
 - name: description
   content: 区块链cita
lang: zh-CN
---

>  CITA 是一个支持智能合约的开源高性能区块链内核(可跨链).[官网简介](https://docs.citahub.com/zh-CN/cita/cita-intro)

## 安装cita

软件依赖: docker(18+)

```sh
# 拉取镜像
docker pull cita/cita-build

mkdir -p /data/cita; cd /data/cita
# cita-cli
wget https://github.com/citahub/cita-cli/releases/download/20.2.2/cita-cli-x86_64-musl-tls-20.2.2.tar.gz
tar -zxvf cita-cli-x86_64-musl-tls-20.2.2.tar.gz
# 复制 CITA-CLI 到 系统可执行文件目录下
sudo cp -rp cita-cli /usr/local/bin/

cd /data/cita/
wget https://github.com/citahub/cita/releases/download/v20.2.0/cita_secp256k1_sha3.tar.gz
tar zxvf cita_secp256k1_sha3.tar.gz
# 创建账号
cita-cli key create

cd cita_secp256k1_sha3
# 初始化链,这里生成了4个节点,当超过1/3节点挂掉时,整条链将不可用
bin/cita create --super_admin "0x37d1c7449bfe76fe9c445e626da06265e9377601" --nodes "127.0.0.1:4000,127.0.0.1:4001,127.0.0.1:4002,127.0.0.1:4003"

bin/cita setup test-chain/0
bin/cita start test-chain/0
# 查看节点是否正常(7个服务)
bin/cita top test-chain/0
```

初始化链可以增加额外参数,[完整参考](https://docs.citahub.com/zh-CN/cita/configuration-guide/chain-config)

<b>eg: 设置经济模式为charge, **默认**为 `Quota` </b>: --contract_arguments SysConfig.economicalModel=1

## 经济模型

### quota

无代币的模式，系统默认模式.系统仅对用户交易消耗的资源进行统计。

### charge

有代币的模式，链上发行代币。系统先对用户交易消耗的资源进行统计 (quotaUsed)，换算为代币对用户进行收费。

## 几个重要的工具

### cita-cli

CITA CLI 是在开发中调试 CITA 的命令行工具，并且支持搜索历史命令，默认支持 secp256k1 和 SM2 加密算法，方便用户与 CITA 交互。以下是一些常用的命令

```sh
# 进入cita-cli
cita-cli
# 查询区块高度
rpc blockNumber
# 查询所有组 scm -h 查看帮助
scm GroupManagement queryGroups
# 新建一个组
# --origin 发起方的组地址
# --name 组名,可重名
# --accounts 新建的组添加账户
# --private-key 管理员private-key
# 返回交易hash,根据交易hash查询交易回执
scm GroupManagement newGroup --origin 0xfFFfFFFFFffFFfffFFFFfffffFffffFFfF020009 --name 7770660000000000000000000000000000000000000000000000000000000000 --accounts "[e1c4021742730ded647590a1686d5c4bfcbae0b0,45a50f45cb81c8aedeab917ea0cd3c9178ebdcae]" --private-key 0xd3a89700672d97b51cac1c5d82fb377913cf3efae44555dc0b94dd74fc8e8931

# 查询当前系统管理员地址
scm AdminManagement admin

# 查询交易
rpc getTransaction --hash 0xf9e5909fa3861e914e2b75a25de8841a0097343cc390ee122d0fb945bdff2d6a

# 查询存证内容 交易content域
tx decode-unverifiedTransaction --content content
# data域即存证的原始数据

# 创建一个账号
key create
 
# 存证
store data --content 0x3474524832041587483261437874876510837787487658976141347658716817365465984753489650 --private-key 0xff15aff541acc355cd010bd8a52b22214f8b54cbffa56b798e406e78eeb4ef90

# 获取交易回执
rpc getTransactionReceipt --hash 0x3bf83f429e0c117433111e1d10e6b865255dba881492d668ddc4c0bd7cc6c89a
# 如果errorMessage域为null,则代表交易成功

# 解析content域数据
tx decode-unverifiedTransaction --content 0x0ab101122064356565386436313239333634343735396462336265663561323132373366381880ade20420a50b2a2934745248320415874832614378748765108377874876589761413476587168173654659847534896503220000000000000000000000000000000000000000000000000000000000000000040014a14ffffffffffffffffffffffffffffffffff0100005220000000000000000000000000000000000000000000000000000000000000000112415c2b3ee0c4d42e34f64b315273ca043d2b4dd2067317dabb6c5c4c1423032408516e73bf1fcdcfb2a570f3d40f6a1a91c6eaa8cb2745f4b6c2acbc3937dc08e701

# 给账户授权(发送交易,新建合约) https://docs.citahub.com/zh-CN/cita/addresses
# private-key为管理员private-key
scm PermissionManagement setAuthorizations --permissions '[ffffffffffffffffffffffffffffffffff021000,ffffffffffffffffffffffffffffffffff021001]' --account 0xd11b05f21aa5d1d7aa077a9ecc2e606e8a4afb3a --private-key 0xd3a89700672d97b51cac1c5d82fb377913cf3efae44555dc0b94dd74fc8e8931
```

### re-birth

**缓存服务器**

如果前端直接与`cita server`交互,会严重影响到server性能,由于链上数据不可篡改, 因此 ReBirth 缓存 block 列表，tx 列表，event logs ，ERC20 列表，前端与 ReBirth 交互，不影响性能 .

```sh
git clone https://github.com/citahub/re-birth.git
cd re-birth
vim .env.local 
# 修改 CITA_URL 为cita server地址
# 使用 rails secret 生成secret覆盖 SECRET_KEY_BASE 

# 第一次运行需要执行 make setup
# 运行 re-birth
make up
# 更新
make update
# 停止 re-birth
make down
```

### microscope

web端应用,可用于查询所有 CITA 链上信息

```sh
git clone https://github.com/citahub/microscope-v2/
yarn install
# 修改serverList为本地 cita server or rebirth server
vim src/utils/config.ts
yarn build
# 部署到nginx
```

## 智能合约支持

### solidity合约(推荐使用)

 CITA 是兼容 EVM 的，所以支持使用 Solidity 编写智能合约 ,**可以通过发送一笔交易来部署合约**。

一个简单的合约:

```solidity
pragma solidity ^0.4.24;
contract Test {
    uint num;
    constructor() public {}
    function set(uint id) public {
        num = id;
    }
    function get() public view returns(uint) {
        return num;
    }
}
```

### 部署solidity合约

```sh
# step 1 编译合约以及获取函数hash 注意编译器版本. 
# docker run --rm -v $(pwd):/root ethereum/solc:0.4.24  --bin --hashes /root/PictureContract.sol
solc Test.sol --bin --hashes
# step 2 通过发送交易部署合约,不管是否成功都会返回交易hash
# 如果启用了权限系统, 发送交易的账户必须有创建合约的权限
cita-cli rpc sendRawTransaction --code [16进制合约字节码] --private-key 0x0b9f750954a2c89637d86f3b645c311615101d69eab671ea4051f62fe8c0db4c --url http://127.0.0.1:1337
# step 3 获取交易回执,得到合约地址contractAddress
cita-cli rpc getTransactionReceipt --hash [交易hash] --url http://127.0.0.1:1337
# step 4 调用set函数(如果启用了权限管理,需要授予权限)
# code: 0x + 函数签名 + 数据
cita-cli rpc sendRawTransaction --code 0x24b8ba5f0000000000000000000000000000000000000000000000000000000000000001 --private-key 0xcf972462f8bca473162b75bcbedf411fcb58083ab44fdfaf90f96d778c7402f1 --address [合约地址] --url http://127.0.0.1:1337
```

### rust原生合约

CITA本身由Rust实现,使用rust编写的智能合约需要与cita源码一起编译 、部署 .

## cita权限系统

在cita权限系统中权限是由合约地址来标识的,可以控制到合约的每一个函数.一个权限的属性包含：

- 可阅读的权限名称
- 目标合约地址
- 对应目标合约的函数签名

### 启用权限系统

在起链时添加参数: ` --contract_arguments SysConfig.checkSendTxPermission=true SysConfig.checkCallPermission=true  SysConfig.checkFeeBackPlatform=true` 

- `checkSendTxPermission` : 发送交易权限检查开关 

- `checkCallPermission` : 合约调用权限检查开关 

- `checkCreateContractPermission` : 创建合约权限检查开关 

由此可表示三种类别的权限：

- 发交易： 系统内置，合约地址:`ffffffffffffffffffffffffffffffffff021000`，权限属性为空
- 创建合约： 系统内置，合约地址: `ffffffffffffffffffffffffffffffffff021001`，权限属性为空
- 调用合约： 分为两类：
  - 内置的权限： 由系统内置的合约地址标识，权限属性包含系统合约的地址和函数签名
  - 用户自定义的权限：由用户创建权限时生成的合约地址标识，权限属性包含参数所表示的地址和函数签名

### 为账户授权

#### 授予账户发送交易,创建合约的权限

```sh
# 使用管理员密钥授予账户发送交易,创建合约的权限
cita-cli scm PermissionManagement setAuthorizations --permissions '[ffffffffffffffffffffffffffffffffff021000,ffffffffffffffffffffffffffffffffff021001]' --account 0x78af0ea8a63d52c27065f4f463ea4b572d5bd2b1 --private-key 0x0b9f750954a2c89637d86f3b645c311615101d69eab671ea4051f62fe8c0db4c --url http://127.0.0.1:1337
```

#### 为账户授予访问合约函数的权限

```sh
# contracts: 上面Demo.sol生成的合约地址
# function-hashes: 函数签名
# private-key: 管理员私钥
# 生成权限(权限的表现形式是一个地址)
cita-cli scm PermissionManagement newPermission --name 0000000000000000000000000000000000000000000000000000000060f22221  --contracts '[00f8d426df8f7b1461440d9c966d51771a828637]' --function-hashes '[24b8ba5f]'  --private-key 0x0b9f750954a2c89637d86f3b645c311615101d69eab671ea4051f62fe8c0db4c --url http://127.0.0.1:1337

# 查看交易回执
cita-cli rpc getTransactionReceipt --hash 0x8a2cd7ac30a2167a35bc360b67396d29eaab6b9b106d22f5e13f459f0f88911f --url http://127.0.0.1:1337
# 从 logs[0] 中获得新权限的地址 
#  --permissions: 新权限的地址
cita-cli scm PermissionManagement setAuthorizations --permissions '[ca645d2b0d2e4c451a2dd546dbd7ab8c29c3dcee]' --account 0x78af0ea8a63d52c27065f4f463ea4b572d5bd2b1 --private-key 0x0b9f750954a2c89637d86f3b645c311615101d69eab671ea4051f62fe8c0db4c --url http://127.0.0.1:1337

# 测试是否成功,使用该账户私钥调用函数
# --code: 0x + 24b8ba5f(函数签名) + 函数入参
cita-cli rpc sendRawTransaction --code 0x60fe47b10000000000000000000000000000000000000000000000000000000000000001 --private-key 0x9629c40a6571240925417743185b1b2ad4dd51518fc9e56ad32ab5976ecd1f1e --address 0x00f8d426df8f7b1461440d9c966d51771a828637 --url http://127.0.0.1:1337
```

### 关于cita权限问题的思考

cita的存证是将存证的内容作为交易数据保存下来的。而且cita为了高性能，是先共识，再执行的。所以对于存证来说，cita的权限系统是拦不住的。因为即使执行失败，tx也已经打包进块，保存下来了。

解决方法有两种：

1. 单纯从链的角度来说，可以用charge模式，这时发交易是需要消耗token的。如果一个用户没有token，还在恶意发交易，会被加入黑名单，这个用户后续发的交易会在最前端就直接丢弃。
2. 从整个产品的角度来说。一般区块链不会直接暴露rpc接口给外部用户，一般前面会再架一个业务系统。可以在业务系统里面做鉴权和拦截。
