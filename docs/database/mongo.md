---
title: mongo
categories:
 - database
tags:
 - mongo
publish: false
---

## install

```sh
# 创建容器卷
docker volume create mongo
docker run --rm -p 27017:27017 --name=mongo -v mongo:/data/db -d mongo
# 客户端工具
docker run --rm -d -p 5000:3000 mongoclient/mongoclient
```

## 访问控制

```sh
# --auth
docker run --rm -p 27017:27017 --name=mongo -v mongo:/data/db -d mongo --auth
# 进入容器
docker exec -it mongo sh
mongo
use admin
# 创建管理员账户
db.createUser({ user: "useradmin", pwd: passwordPrompt(), roles: [{ role: "userAdminAnyDatabase", db: "admin" }] })
db.auth("useradmin", passwordPrompt())
# 创建用户
# role: dbOwner 最高权限
db.createUser({ user: "liukai", pwd: "123456", roles: [{ role: "dbOwner", db: "meteor" }] })
```

### 内置角色

- Read：允许用户读取指定数据库
- readWrite：允许用户读写指定数据库
- dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile
- userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户
- clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。
- readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限
- readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限
- userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限
- dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。
- root：只在admin数据库中可用。超级账号，超级权限