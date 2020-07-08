---
title: 谈谈web安全
date: 2020-06-26
categories:
 - web
tags:
 - security
publish: false
---

> 一个健壮的、牢不可破的系统应该是：**即使被拿走了数据和所有的代码，也没办法破解里面的数据。**

1. 首先保障数据很难被拖库。

2. 即使数据被拖库，攻击者也无法从中破解出用户的密码。

3. 即使数据被拖库，攻击者也无法伪造登录请求通过验证。

4. 即使数据被拖库，攻击者劫持了用户的请求数据，也无法破解出用户的密码

## 鉴权

鉴权（authentication）是指验证用户是否拥有访问系统的权利。 

常用的鉴权有四种：

- HTTP Basic Authentication
- session-cookie
- Token 验证
- OAuth(开放授权)

### 针对Web的攻击技术

