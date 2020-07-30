---
title: 分布式账本corda
date: 2020-03-03
categories:
 - block chain
tags:
 - corda
 - kotlin
---

## 简介

Corda 是一个分布式账本平台，用于记录，管理和自动化业务合作伙伴之间的法律协议。由世界上最大的金融机构设计，并且在多个行业都有应用。

corda内核使用kotlin开发,官方提供了java/kotlin SDK.

## 核心概念

- network(网络) -- corda节点存在于corda网络
  - 每个corda节点运行一个corda实例和多个cordapps
  - 节点通信点对点,不依赖全局广播,并在传输层加密,corda使用持久队列(像email),节点可脱机
  - 每个节点有一个身份证书,该证书将其网络身份映射到实际的法律身份
- ledger(分类账) --  分类帐以及分类帐上的事实如何在节点之间共享 
  - **corda没有数据中心,需要自己实现**
  - **corda节点只能看到自己参与的事实,或他人共享的事实**
- states -- 代表ledger上事实状态
  - 历史状态不可改变,需要创建新的状态去更新状态
- contracts -- 合约决定 state的发展方向
- transactions -- 通过交易去更新ledger状态
  - 不包含双花(一笔交易无法花费2次money)
  - 合约有效
  - 各方签名
- flow -- 合约各方达成共识进行的交互
- consensus(共识) -- 各方如何就分类账上的共享事实达成共识 
- notaries(公证人) -- 确保唯一性共识(放双花)的组件
- vault(保管库) -- 为节点提供存储,查询事实的组件

## flow

Flow,可以理解为**智能合约**,这将是我们要编写的核心部分,根据`flow` 编写业务逻辑.一个flow有2个部分

-  Initiator  发起人
-  Responder   响应人

### Initiator  

1. 建立交易
   - 选择交易公证人 
   - 创建交易生成器
   - 从库中提取所有输入状态,并将其添加到构建器中
   - 创建任何输出状态并将其添加到构建器 
   - 将任何命令，附件和时间窗口添加到构建器 
2. 签署交易
   -  签署交易生成器 
   -  将构建器转换为已签名的交易 
3. 验证交易
   - 通过运行合同来验证交易
4. 收集交易对手的签名
   - 将交易发送给交易对手
   - 等待收到对方的签名
   - 在交易中添加交易对手的签名
   - 验证交易签名
5. 完成交易
   -  将交易发送给公证人 
   -  等待收回经过公证的交易 
   -  在本地记录交易 
   -  将任何相关状态存储在Vault中 
   -  将交易发送给交易对手进行记录 

### Responder   

1. 签署交易
   - 接收交易对手的交易
   - 验证交易的现有签名
   - 通过运行合同来验证交易
   - 生成交易签名
   - 将签名发送回交易对手
2. 记录交易
   - 接收对方的公证交易
   - 在本地记录交易
   - 将任何相关状态存储在Vault中

### FlowLogic

流需要继承` FlowLogic`

```java
public static class Initiator extends FlowLogic<T> {}
```

- 如果需要调用其他流, target需要加上` @InitiatingFlow`注解
- 如果使用RPC调用流, 需要加上` @StartableByRPC`注解
- 任何响应来自另一个流的消息的流都必须使用注释进行`@InitiatedBy(targetFlow.class)`注解
- Additionally, any flow that is started by a `SchedulableState` must be annotated with the `@SchedulableFlow` annotation. 

### call

每个`FlowLogic`子类都必须重写`FlowLogic.call()`. Initiator.call, Responder.call 

为了使节点能同时运行多个流,给call方法加上@Suspendable注解

## transaction

交易是原子的.一笔完整的交易:

<img src="https://s1.ax1x.com/2020/07/05/USDvee.png" alt="transaction" border="0" />

两种类型:

- 公证员变更交易
- 普通交易

### 交易链

创建一个新的交易需要以下输入

- 创建输入的事务的hash
- 上次交易的输出中的输入索引

每个必需的签名者仅应在满足以下两个条件的情况下签名交易：

- **交易有效性**：对于建议的交易以及创建当前建议的交易输入的交易链中的每个交易：
  - 交易由所有必要方进行数字签名
  - 该交易具有*合同效力*（请参见 [合同](https://docs.corda.net/docs/corda-os/4.4/key-concepts-contracts.html)）
- **交易唯一性**：没有其他已承诺交易消耗了我们提议的交易的任何输入（请参阅 [共识](https://docs.corda.net/docs/corda-os/4.4/key-concepts-consensus.html)）

## corda节点

一个corda节点目录结构

- additional-node-infos   // 节点的网络信息
- certificates // 节点的证书
- corda.jar // corda官方提供的节点实现
- cordapps // 这一部分是合约代码
- drivers // 节点监控驱动
- logs // 日志
- network-parameters // 自动从网络服务器上下载的节点网络参数
- node.conf // 节点配置

## corda network

https://docs.corda.net/permissioning.html

## 共识机制

## 证书层次结构

Corda网络具有三种类型的证书颁发机构（CA）：

- 所述**根网络CA**限定兼容性区的范围
- 使用**门卫CA**代替根网络CA进行日常密钥签名，以减少根网络CA的私钥受到破坏的风险。这等效于Web PKI中的中间证书
- 每个节点还充当其自己的CA，颁发其用于签名其身份密钥和TLS证书的子证书

每个证书都包含一个X.509扩展名，该扩展名定义了系统中证书/密钥的角色（有关详细信息，请参见下文）。它还使用X.509名称约束来确保将编码人类有意义身份的X.500名称正确传播到所有子证书。施加以下约束：

- 门卫证书由网络根颁发。网络根证书不包含角色扩展
- 节点证书由门卫证书签名（由扩展名定义）
- 合法身份/ TLS证书由标记为节点CA的证书颁发
- 机密身份证书由标记为已知合法身份的证书颁发
- 政党证书被标记为众所周知的身份或机密身份

## 网络地图服务

corda官方提供了3种网络构建工具,corda节点通过**网络地图服务**相互发现彼此.

### Corda Network Builder(测试用)

 https://docs.corda.net/docs/corda-os/4.4/network-builder.html 

### Network Bootstrapper(测试用)

 https://docs.corda.net/docs/corda-os/4.4/network-bootstrapper.html 

### network-map-service

 https://gitlab.com/cordite/network-map-service/-/tree/master/ 

```sh
git clone https://gitlab.com/cordite/network-map-service.git

mvn clean install -DskipTests

cd target
# 生产环境下启动之前先设置环境变量
# 所有配置 https://gitlab.com/cordite/network-map-service/-/tree/master/
# set NMS_ROOT_CA_NAME = your_ca_name
# set NMS_ROOT_CA_FILE_PATH = your_ca_file_path
# set NMS_AUTH_USERNAME = account
# set NMS_AUTH_PASSWORD = passwd
# set NMS_CERTMAN_TRUSTSTORE = 
# set NMS_CERTMAN_TRUSTSTORE_PASSWORD = 
java -jar network-map-service.jar
```

