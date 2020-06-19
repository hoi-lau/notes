# postgresql

## 安装

``` shell
brew install postgresql
```

安装成功后会自动初始化

## createdb

创建名为` test`的数据库

```shell
createdb test
```

## 允许远程访问

修改data目录下的pg_hba.conf和postgresql.conf配置文件

修改pg_hba.conf文件，配置用户的访问权限

```shell
# 新增一行  允许网段 192.168.1.0 的所有主机访问
host  all    all    192.168.1.0/24    md5
```

修改postgresql.conf文件

listen_addresses = '*' 允许数据库服务器监听来自任何主机的连接请求