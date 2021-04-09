---
title: http
date: 2021-02-05
tags:
 - http
publish: false
---

## 报文结构

### 请求报文

- **请求行:**  请求方法 url HTTP协议版本. GET /api HTTP/1.1。
- **请求头部:**  键值对
- **请求体:**  POST PUT携带的数据

### 响应报文

- **响应行:**  协议版本，状态码和状态码的原因短语组成. HTTP/1.1 200 OK
- **响应头:**  键值对
- **响应体:**  POST PUT携带的数据

## 方法

`HTTP1.0:`  `POST`, `GET`, `HEAD`

`HTTP1.1:` 新增了五种请求方法：`OPTIONS`, `PUT`, `DELETE`, `TRACE` 和 `CONNECT`

## 常用HTTP头

### 通用

- Cache-Control 控制缓存 ✨
- Connection 连接管理、逐条首部 ✨
- Upgrade 升级为其他协议
- via 代理服务器的相关信息
- Wraning 错误和警告通知
- Transfor-Encoding 报文主体的传输编码格式 ✨
- Trailer 报文末端的首部一览
- Pragma 报文指令
- Date 创建报文的日期

### 请求头

- Accept 客户端或者代理能够处理的媒体类型 ✨
- Accept-Encoding 优先可处理的压缩方式
- Accept-Language 优先可处理的自然语言
- Accept-Charset 优先可以处理的字符集
- If-Match 比较实体标记（ETage） ✨
- If-None-Match 比较实体标记（ETage）与 If-Match相反 ✨
- If-Modified-Since 比较资源更新时间（Last-Modified）✨
- If-Unmodified-Since比较资源更新时间（Last-Modified），与 If-Modified-Since相反 ✨
- If-Rnages 资源未更新时发送实体byte的范围请求
- Range 实体的字节范围请求 ✨
- Authorization web的认证信息 ✨
- Proxy-Authorization 代理服务器要求web认证信息
- Host 请求资源所在服务器 ✨
- From 用户的邮箱地址
- User-Agent 客户端程序信息 ✨
- Max-Forwrads 最大的逐跳次数
- TE 传输编码的优先级
- Referer 请求原始放的url
- Expect 期待服务器的特定行为

### 响应头

- Accept-Ranges 能接受的字节范围
- Age 推算资源创建经过时间
- Location 令客户端重定向的URI ✨
- vary 代理服务器的缓存信息
- ETag 能够表示资源唯一资源的字符串 ✨
- WWW-Authenticate 服务器要求客户端的验证信息
- Proxy-Authenticate 代理服务器要求客户端的验证信息
- Server 服务器的信息 ✨
- Retry-After 和状态码503 一起使用的首部字段，表示下次请求服务器的时间

## HTTP1.0与HTTP1.1的区别

1. **缓存处理**，在HTTP1.0中主要使用header里的If-Modified-Since,Expires来做为缓存判断的标准，HTTP1.1则引入了更多的缓存控制策略例如Entity tag，If-Unmodified-Since, If-Match, If-None-Match等更多可供选择的缓存头来控制缓存策略。
2. **带宽优化及网络连接的使用**，HTTP1.0中，存在一些浪费带宽的现象，例如客户端只是需要某个对象的一部分，而服务器却将整个对象送过来了，并且不支持断点续传功能，HTTP1.1则在请求头引入了range头域，它允许只请求资源的某个部分，即返回码是206（Partial Content），这样就方便了开发者自由的选择以便于充分利用带宽和连接。
3. **错误通知的管理**，在HTTP1.1中新增了24个错误状态响应码，如409（Conflict）表示请求的资源与资源的当前状态发生冲突；410（Gone）表示服务器上的某个资源被永久性的删除。
4. **Host头处理**，在HTTP1.0中认为每台服务器都绑定一个唯一的IP地址，因此，请求消息中的URL并没有传递主机名（hostname）。但随着虚拟主机技术的发展，在一台物理服务器上可以存在多个虚拟主机（Multi-homed Web Servers），并且它们共享一个IP地址。HTTP1.1的请求消息和响应消息都应支持Host头域，且请求消息中如果没有Host头域会报告一个错误（400 Bad Request）。
5. **长连接**，HTTP 1.1支持长连接（PersistentConnection）和请求的流水线（Pipelining）处理，在一个TCP连接上可以传送多个HTTP请求和响应，减少了建立和关闭连接的消耗和延迟，在HTTP1.1中默认开启Connection： keep-alive，一定程度上弥补了HTTP1.0每次请求都要创建连接的缺点

## HTTP2

- 二进制传输
- 头部压缩
- 多路复用
- 服务器推送