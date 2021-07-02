---
title: postgresql
categories:
 - database
tags:
 - postgresql
publish: false
---

## 安装

``` shell
# brew install postgresql
docker volume create postgre
docker run --rm --name postgres -v postgre:/var/lib/postgresql/data -p 5431:5432 -e POSTGRES_PASSWORD=A,ad17OlqaLBnh -d postgres
```

## 服务器管理

### psql

使用`psql`客户端管理`postgresql`数据库

```sh
# 进入容器
docker exec -it postgres bash
psql -U liuk postgres
# help
\h
```

### database

```sh
# 创建test数据库
create database test;
# 查询所有的数据库
SELECT datname FROM pg_database;
# 删除test数据库
drop database test;
```

### 用户管理

```sh
# 创建一个带有LOGIN属性的角色
create user liuk password '123456';
```

## tips

### 手动安装允许远程访问

修改data目录下的pg_hba.conf和postgresql.conf配置文件

修改pg_hba.conf文件，配置用户的访问权限

```shell
# 新增一行  允许网段 192.168.1.0 的所有主机访问
host  all    all    192.168.1.0/24    md5
```

修改postgresql.conf文件

listen_addresses = '*' 允许数据库服务器监听来自任何主机的连接请求

## doc

### 创建自增id

## driver

#### nodejs

```sh
npm i pg
# driver
```

#### connecting

```js
const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'liuk',
  host: 'localhost',
  database: 'blog-cms',
  password: '123456',
  port: 5432,
})
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
```

**必须在相同的client实例上使用事务!!**
