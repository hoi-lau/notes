# build_tools

corda官方提供了3种网络构建工具

## Corda Network Builder(测试用)

 https://docs.corda.net/docs/corda-os/4.4/network-builder.html 

## Network Bootstrapper(测试用)

 https://docs.corda.net/docs/corda-os/4.4/network-bootstrapper.html 

## network-map-service

 https://gitlab.com/cordite/network-map-service/-/tree/master/ 

```shell
git clone https://gitlab.com/cordite/network-map-service.git

mvn clean install -DskipTests

cd target
# 生产环境下启动之前先设置环境变量 (windows 使用 set 命令, linux 使用 export)
# 所有配置 https://gitlab.com/cordite/network-map-service/-/tree/master/
# set NMS_ROOT_CA_NAME = your_ca_name
# set NMS_ROOT_CA_FILE_PATH = your_ca_file_path
# set NMS_AUTH_USERNAME = account
# set NMS_AUTH_PASSWORD = passwd
# set NMS_CERTMAN_TRUSTSTORE = 
# set NMS_CERTMAN_TRUSTSTORE_PASSWORD = 
java -jar network-map-service.jar
```



```shell
#!/bin/sh
# 创建CA密钥对和CA PEM文件
keytool -genkeypair -keyalg EC -keysize 256 -alias ca -dname "CN=Root CA, OU=root, O=root, L=gz, ST=gd, C=CN" -ext bc:ca:true,pathlen:1 -ext bc:c -ext eku=serverAuth,clientAuth,anyExtendedKeyUsage -ext ku=digitalSignature,keyCertSign,cRLSign -keystore ca.jks -storepass z2doa1 -keypass z2doa1

keytool -exportcert -rfc -alias ca -keystore ca.jks -storepass z2doa1 -keypass z2doa1 > ca.pem

# 使用证书和密钥别名创建密钥对
keytool -genkeypair -keyalg EC -keysize 256 -alias cert -dname "CN=Root CA, OU=root, O=root, L=gz, ST=gd, C=CN" -ext bc:ca:true,pathlen:1 -ext bc:c -ext eku=serverAuth,clientAuth,anyExtendedKeyUsage -ext ku=digitalSignature,keyCertSign,cRLSign -keystore root.jks -storepass z2doa1 -keypass z2doa1

keytool -genkeypair -keyalg EC -keysize 256 -alias key -dname "CN=Root CA, OU=root, O=root, L=gz, ST=gd, C=CN" -ext bc:ca:true,pathlen:1 -ext bc:c -ext eku=serverAuth,clientAuth,anyExtendedKeyUsage -ext ku=digitalSignature,keyCertSign,cRLSign -keystore root.jks -storepass z2doa1 -keypass z2doa1

#  创建证书签名请求并导入到密钥库root.jks中
keytool -certreq -alias cert -keystore root.jks -storepass z2doa1 -keypass z2doa1 | keytool -gencert -ext eku=serverAuth,clientAuth,anyExtendedKeyUsage -ext bc:ca:true,pathlen:1 -ext bc:c -ext ku=digitalSignature,keyCertSign,cRLSign -rfc -keystore ca.jks -alias ca -storepass z2doa1 -keypass z2doa1 > cert.pem
  
keytool -certreq -alias key -keystore root.jks -storepass z2doa1 -keypass z2doa1 | keytool -gencert -ext eku=serverAuth,clientAuth,anyExtendedKeyUsage -ext bc:ca:true,pathlen:1 -ext bc:c -ext ku=digitalSignature,keyCertSign,cRLSign -rfc -keystore ca.jks -alias ca -storepass z2doa1 -keypass z2doa1 > key.pem
    
keytool -importcert -noprompt -file cert.pem -alias cert -keystore root.jks -storepass z2doa1 -keypass z2doa1

keytool -importcert -noprompt -file key.pem -alias key -keystore root.jks -storepass z2doa1 -keypass z2doa1

#  如果将生成的root.jks传递给NMS，我们将获得无效的签名，因此要解决该问题，请执行以下步骤
mv root.jks old.jks
  
keytool -importkeystore -srcstorepass z2doa1 -srckeystore old.jks -deststorepass z2doa1 -destkeystore old.p12 -deststoretype pkcs12 

openssl pkcs12 -in old.p12 -out pemfile.pem -nodes -passin pass:z2doa1 -passout pass:z2doa1

openssl pkcs12 -export -in pemfile.pem -name cert -out cert.p12 -passin pass:z2doa1 -passout pass:z2doa1

openssl pkcs12 -export -in pemfile.pem -name key -out key.p12 -passin pass:z2doa1 -passout pass:z2doa1

keytool -importkeystore -srcstorepass z2doa1 -srckeystore cert.p12 -deststorepass z2doa1 -destkeystore root.jks -srcstoretype pkcs12 

keytool -importkeystore -srcstorepass z2doa1 -srckeystore key.p12 -deststorepass z2doa1 -destkeystore root.jks -srcstoretype pkcs12 

# 查看密钥库
keytool -list -v -keystore root.jks -storepass z2doa1

```

