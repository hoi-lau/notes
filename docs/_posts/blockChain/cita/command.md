# cita-cli

```shell
 # 查询区块高度
 rpc blockNumber
 # 查询所有组
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

