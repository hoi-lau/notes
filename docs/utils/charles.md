---
title: 羊了个羊-如何通过第二关
date: 2022-09-19
categories:
 - utils
tags:
 - http
meta:
 - name: description
   content: 羊了个羊-如何通过第二关
 - name: keywords
   content: charles,抓包,http(s),proxy,response rewrite
---

> 通关原理: 将第二关修改为第一关

## before

安装任意一个网络代理工具, `fiddler` 或`burp suite`,以`charles`为例.

<a href="https://www.charlesproxy.com/" target="_blank">官网下载</a>

## 设置代理

设置代理端口号,这里是8866

<img class="zoom-custom-imgs" src="https://z3.ax1x.com/2021/09/03/hyzlB6.md.png" alt="hyzlB6.png" border="0" />

## 抓包https

必须安装charles的证书才能解密https传输的内容

手机连入同一局域网, 设置wifi的http代理为上面设置的代理,使用**系统浏览器**打开域名` https://chls.pro/ssl`, 下载证书, 安装证书到手机, 信任并启用证书.

## 设置rewrite规则

<img class="zoom-custom-imgs" src="https://z3.ax1x.com/2021/09/03/h6CMGD.md.png" alt="h6CMGD.png" border="0" />

<img class="zoom-custom-imgs" src="https://z3.ax1x.com/2021/09/03/h6Zn8P.md.png" alt="h6Zn8P.png" border="0" />

<img class="zoom-custom-imgs" src="https://z3.ax1x.com/2021/09/03/h6NdtP.md.png" alt="h6NdtP.png" border="0" />

测试一下, 将百度的网站中`百度一下`替换成`百度两下`

<img class="zoom-custom-imgs" src="https://z3.ax1x.com/2021/09/03/h6a92T.md.png" alt="h6a92T.png" border="0" />

ok, 证书配置正确. 打开微信小游戏-羊了个羊, 

<img class="zoom-custom-imgs" src="https://img.imliuk.com/202209192027606.jpg" alt="https://img.imliuk.com/202209192027606.jpg" border="0" />

`map_info_new`这个接口的作用是获取地图信息, 查询参数`map_id`代表关卡, `80001`代表第一关, `90019`代表第二关(第二关的`map_id`是会变的,比如今天是9月19日, 90019, 明天就可能是90020), 将第一关的返回值(字段`data`)替换掉第二关的返回值,这样第二关的内容将会被第一关的内容替代.

<img class="zoom-custom-imgs" src="https://img.imliuk.com/202209192037679.jpg"/>

## end

附上过关截图,20秒过关,😂

<img class="zoom-custom-imgs" src="https://img.imliuk.com/202209192038055.jpg"/>