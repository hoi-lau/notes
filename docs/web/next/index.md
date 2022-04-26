---
title: next-服务端开发框架
date: 2021-05-15
categories:
 - web
tags:
 - js
lang: zh-CN
publish: false

---

## start

```sh
npm i -g @nestjs/cli
nest new project-name
```

- main.ts: 应用程序的入口文件，它使用核心函数 `NestFactory` 来创建 Nest 应用程序的实例。

## 自定义配置文件

## 连接数据库

### 安装数据库驱动

```sh
npm install pg --save
# postgresql
npm install mysql --save
# mysql 或者 mysql2
```

