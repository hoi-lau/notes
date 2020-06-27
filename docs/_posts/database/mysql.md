---
title: mysql & FAQ
category:
 - database
tags:
 - mysql
publish: false
---

## FAQ && USAGE

### 忘记密码

关闭mysql -> 以安全模式启动mysql -> mysql -uroot -> 设置密码

``` shell
brew services stop mysql
## 或者 kill -9 pid
## cd mysql/bin
## 以安全模式启动
mysqld_safe --skip-grant-tables
## mysql -uroot
## 刷新权限
FLUSH PRIVILEGES;
## 修改密码复杂度(可选)
show variables like 'validate_password%';
set global validate_password.policy=low;
## 修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY '12345678' PASSWORD EXPIRE NEVER;
```

### 创建用户

``` shell
 CREATE USER 'liuk'@'host' IDENTIFIED BY '12345678';
 ## 修改用户host, 允许远程访问
 update mysql.user set host='%' where user='liuk';
```

host：指定该用户在哪个主机上可以登陆，如果是本地用户可用localhost，如果想让该用户可以从任意远程主机登陆，可以使用通配符%
CREATE USER 'pig'@'192.168.1.101_' IDENDIFIED BY '123456';
CREATE USER 'pig'@'%' IDENTIFIED BY '123456';

### 授予权限

尽量使用 root 用户

` GRANT ALL ON *.* TO 'pig'@'%'; `

### 查看mysql配置文件位置

` mysql --verbose --help | grep my.cnf `

### 进入安全模式

` mysql_secure_installation `

### 删除用户

` DROP USER 'username'@'host'; `