---
title: 使用openssl生成证书
category:
 - util
tags:
 - openssl
---

OpenSSL 是一个开源项目，其组成主要包括一下三个组件：

- openssl：多用途的命令行工具
- libcrypto：加密算法库
- libssl：加密模块应用库，实现了ssl及tls

openssl可以实现：秘钥证书管理、对称加密和非对称加密 。

## 对称加密

对称加密需要使用的标准命令为 enc 

常用选项有：

-in filename：指定要加密的文件存放路径

-out filename：指定加密后的文件存放路径

-salt：自动插入一个随机数作为文件内容加密，默认选项

-e：可以指明一种加密算法，若不指的话将使用默认加密算法

-d：解密，解密时也可以指定算法，若不指定则使用默认算法，但一定要与加密时的算法一致

-a/-base64：使用-base64位编码格式

Eg: 

```shell
## 加密
openssl enc -e -des3 -a -salt -in fstab -out jiami
## 解密
openssl enc -d -des3 -a -salt -in jiami -out jiemi
```

## 非对称加密算法

 OpenSSL一共实现了4种非对称加密算法，包括DH算法、RSA算法、DSA算法和椭圆曲线算法（EC）。DH算法一般用户密钥交换。RSA算法既可以用于密钥交换，也可以用于数字签名，当然，如果你能够忍受其缓慢的速度，那么也可以用于数据加密。DSA算法则一般只用于数字签名。

## 摘要命令

` openssl dgst `

``` shell
## liuk@localhost ssl % 
openssl dgst -sha256 'test.md'
## SHA256(test.md)= 3bc253880f4705fc21b3eba31bccd29f8bac6b083dd6b1787dd3d7ef2bfe8048
```

## 生成ssl自签名证书

``` shell
# 1.生成私钥
openssl genrsa -des3 -out root.key 3072
# 输入密码,确认,至少4位数 4321
# 2.去除私钥中的密码
openssl rsa -in root.key -out root.key
# 3.生成csr(证书请求文件)
# -subj 后面可选
openssl req -new -key root.key -out root.csr -subj "/C=CN/ST=Guangdong/L=Guangzhou/O=xdevops/OU=xdevops/CN=gitlab.xdevops.cn"
# 生成ssl证书
openssl x509 -req -days 3650 -in root.csr -signkey root.key -out root.crt
```

## 根证书签发二级根证书

``` shell
# 1.生成自己的私钥my-private.key
# 2.生成my-private.csr
# 3.由根证书签发csr 假设顶级根证书: root.crt,root.key
[corda@localhost node-0]$ openssl x509 -req -in node-0/node0.csr -out node-0/node0.crt -signkey node-0/node0.key -CA root.crt -CAkey root.key -CAcreateserial  -days 36500

```

## crt证书转为jks证书

```sh
# 转为p12
openssl pkcs12 -export -in from.crt -inkey privatekey.key -out to.p12
# p12转为jks
keytool -importkeystore -srcstoretype pkcs12 -srckeystore server.p12 -destkeystore server.jks -deststoretype jks 
```
查看jks证书内容
keytool -v -list -keystore  ******.jks