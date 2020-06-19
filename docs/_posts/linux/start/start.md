## os install

```
// 阿里镜像地址
https://developer.aliyun.com/mirror
```

> U盘  >  16G

> 写入镜像

> 安装系统

> 选择功能

> 启用网络

> 设置管理员

## yum换源

https://developer.aliyun.com/mirror/centos?spm=a2c6h.13651102.0.0.15231b11YXgbPi

配置文件备份

```shell
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum makecache
```

## 关闭防火墙

```sh
# 关闭防火墙
service firewalld stop
# 查看防火墙状态
service firewalld status
# 禁止自启动
chkconfig firewalld off
```

## 配置java环境变量

```shell
# --java 环境变量---
# 找到java安装目录
JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64
JRE_HOME=$JAVA_HOME/jre
CLASS_PATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JRE_HOME/lib
PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin
export JAVA_HOME JRE_HOME CLASS_PATH PATH
# -----------------
```

