---
title: linux学习
date: 2020-02-18
categories: 
 - linux
tags:
 - FAQ
publish: false
---

## 网络启动失败

failed to start lsb bring up/down networking

```shell
journalctl -xe >> network-error.log
# 查看日志
# 1.ip被占用 2.关闭NetworkManager 3.修改mac地址 4.或是其他原因
```

## 设置静态ip & DNS

``` shell
vi /etc/sysconfig/network-scripts/ifcfg-eth0
# ifcfg-eth0 网卡名

BOOTPROTO="static"
IPADDR="your_IP"
GATEWAY="your_gateway"
NETMASK="255.255.255.0"
# 取消networkmanager管理
NM_CONTROLLED=no

# 配置DNS
vi /etc/NetworkManager/NetworkManager.conf
dns=none
vi /etc/resolv.conf 
nameserver 114.114.114.114

systemctl restart network
```

## 去除蜂鸣声

切换到root用户在 vim /etc/rc.d/rc.local 最后一行添加 rmmod pcspkr

运行这个shell脚本文件 /etc/rc.d/rc.local 即可

## 开放端口

firewall-cmd --zone=public --add-port=4000/tcp --permanent

firewall-cmd --reload

 命令含义：
--zone #作用域
--add-port=1935/tcp  #添加端口，格式为：端口/通讯协议
--permanent  #永久生效，没有此参数重启后失效

## ssh

```shell
# client_loop: send disconnect: Broken pipe
vim /etc/ssh/ssh_config
# Host *条目下添加 IPQoS=throughput

# 内网ssh连接过慢
vim /etc/ssh/sshd_conf
# UseDNS no
# GSSAPIAuthentication no
service sshd restart
```

### ssh配置密钥登录

1. 用密码登录到打算使用密钥登录的账户 

2. 将公钥写入`.ssh/authorized_keys` 文件中

3. 编辑 /etc/ssh/sshd_config 文件，进行如下设置：

   ```
   RSAAuthentication yes
   PubkeyAuthentication yes
   ```

   另外，请留意 root 用户能否通过 SSH 登录：

   ```
   PermitRootLogin yes
   ```

   当你完成全部设置，并以密钥方式登录成功后，再禁用密码登录：

   ```
   PasswordAuthentication no
   ```

   最后，重启 SSH 服务.

登录: `ssh -i private_key root@ip`

