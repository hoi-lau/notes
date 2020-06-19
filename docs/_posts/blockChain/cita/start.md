# cita

软件依赖: docker(18+)

```shell
# 拉取镜像
$ docker pull cita/cita-build

$ mkdir -p /data/cita; cd /data/cita
# cita-cli
$ wget https://github.com/citahub/cita-cli/releases/download/20.2.2/cita-cli-x86_64-musl-tls-20.2.2.tar.gz
$ tar -zxvf cita-cli-x86_64-musl-tls-20.2.2.tar.gz
# 复制 CITA-CLI 到 系统可执行文件目录下
$ sudo cp -rp cita-cli /usr/local/bin/

$ cd /data/cita/
$ wget https://github.com/citahub/cita/releases/download/v20.2.0/cita_secp256k1_sha3.tar.gz
$ tar zxvf cita_secp256k1_sha3.tar.gz
# 创建账号
$ cita-cli key create

$ cd cita_secp256k1_sha3
# 初始化链
$ bin/cita create --super_admin "0x37d1c7449bfe76fe9c445e626da06265e9377601" --nodes "127.0.0.1:4000,127.0.0.1:4001,127.0.0.1:4002,127.0.0.1:4003"

$ bin/cita setup test-chain/0
$ bin/cita start test-chain/0
# 查看节点是否正常(7个服务)
$ bin/cita top test-chain/0
```

初始化链额外参数 

https://docs.citahub.com/zh-CN/cita/configuration-guide/chain-config 

<b>eg</b>: --contract_arguments SysConfig.economicalModel=1

设置经济模式为charge, **默认**为 `Quota` 

**eg**: --contract_arguments SysConfig.checkSendTxPermission=true SysConfig.checkCallPermission=true  SysConfig.checkFeeBackPlatform=true

全开权限系统

