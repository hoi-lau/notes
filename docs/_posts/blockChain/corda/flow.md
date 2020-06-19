# flow

一个flow有2个部分

-  Initiator  发起人
-  Responder   响应人

## Initiator  

1. 建立交易
   - 选择交易公证人 
   - 创建交易生成器
   - 从库中提取所有输入状态,并将其添加到构建器中
   -  创建任何输出状态并将其添加到构建器 
   -  将任何命令，附件和时间窗口添加到构建器 
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

<!-- <img src="../img/corda/flow-overview.png"> -->

## Responder   

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

## FlowLogic

流需要继承` FlowLogic`

```java
public static class Initiator extends FlowLogic<T> {}
```

- 如果需要调用其他流, target需要加上` @InitiatingFlow`注解
- 如果使用RPC调用流, 需要加上` @StartableByRPC`注解
-  任何响应来自另一个流的消息的流都必须使用注释进行`@InitiatedBy(targetFlow.class)`注解
-  Additionally, any flow that is started by a `SchedulableState` must be annotated with the `@SchedulableFlow` annotation. 

## call

每个`FlowLogic`子类都必须重写`FlowLogic.call()`. Initiator.call, Responder.call 

为了使节点能同时运行多个流,给call方法加上@Suspendable注解