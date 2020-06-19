# corda部署流程

事先准备好cordapp

## 1.自签发证书

所需证书:

- `network-root-truststore.jks`, 顶级根证书

- `truststore.jks`, 签发节点证书的根证书

- `nodekeystore.jks`, 节点的身份证书

- `sslkeystore.jks`, 节点的ssl证书

<b>生成节点证书后需要保证节点配置中的 `myLegalName`与证书身份信息保持一致</b>

密钥库使用以下别名存储密钥对和证书：

- `nodekeystore.jks`使用别名`cordaclientca`和`identity-private-key`
- `sslkeystore.jks` 使用别名 `cordaclienttls`

所有密钥库都使用`keyStorePassword`属性使用节点配置文件中提供的密码。如果未配置密码，则默认为`cordacadevpass`。

### 1.自签发网络根证书

```shell
CN,gd,gz,root,root,ml,123@123.com,123456
# 产生私钥
openssl genrsa -des3 -out ca.key 3072
# csr
openssl req -new -key ca.key -out ca.csr
# issue
openssl x509 -req -days 36500 -in ca.csr -signkey ca.key -out ca.crt
```

## 2.生成sslkeystore.jks

```shell
# 产生私钥
keytool -genkeypair -alias cordaclienttls -keyalg RSA  -ext BC=ca:FALSE -keysize 3072 -keystore sslkeystore.jks -v
# csr
keytool -certreq -alias cordaclienttls -keystore sslkeystore.jks -file sslkeystore.csr -v
# issue
openssl x509 -req -days 36500 -in sslkeystore.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out sslkeystore.crt
# 根证书导入 ssl keystore
keytool -importcert -trustcacerts -alias cordarootca -file ca.crt -keystore sslkeystore.jks
# ssl证书导入 ssl keystore
keytool -importcert -alias cordaclienttls -file sslkeystore.crt -keystore sslkeystore.jks
# node0: CN=liukai, OU=node0, O=node0, L=gz, ST=gd, C=CN
# node1: CN=liukai, OU=node1, O=node1, L=gz, ST=gd, C=CN

```

## 3.生成nodekeystore.jks

```shell
# 产生私钥
keytool -genkeypair -alias cordaclientca -keyalg RSA  -ext BC=ca:TRUE -keysize 3072 -keystore nodekeystore.jks -v
# csr
keytool -certreq -alias cordaclientca -keystore nodekeystore.jks -file nodekeystore.csr -v
# issue
openssl x509 -req -days 36500 -in nodekeystore.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out nodekeystore.crt
# 根证书导入 nodekeystore
keytool -importcert -trustcacerts -alias cordarootca -file ca.crt -keystore nodekeystore.jks
# nodekeystore证书导入 nodekeystore
keytool -importcert -alias cordaclientca -file nodekeystore.crt -keystore nodekeystore.jks
```

## 4.生成truststone.jks

``` shell
keytool -importcert -trustcacerts -alias cordarootca -file ca.crt -keystore truststore.jks
```

