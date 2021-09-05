---
title: charles 抓包 修改response
date: 2021-09-03
categories:
 - utils
tags:
 - http
meta:
 - name: description
   content: Charles是一款用于HTTP信息抓包工具，可以快速有效的获得HTTP信息，非常利于开发者的网页开发和调试修改, charles目前只支持抓到部分socket的数据. charles抓包的简单使用.charles rewrite
 - name: keywords
   content: charles,抓包,http(s),proxy,response rewrite
---

## 安装

<a href="https://www.charlesproxy.com/" target="_blank">官网下载</a>

## 设置代理

设置代理端口号,这里是8866

<img class="zoom-custom-imgs" src="https://z3.ax1x.com/2021/09/03/hyzlB6.md.png" alt="hyzlB6.png" border="0" />

## 抓包https

必须安装charles的证书才能解密https传输的内容

手机连入同一局域网, 设置wifi的http代理为上面设置的代理,使用**系统浏览器**打开域名` https://chls.pro/ssl`, 下载证书, 安装证书到手机

## rewrite

设置rewrite规则

<img class="zoom-custom-imgs" src="https://z3.ax1x.com/2021/09/03/h6CMGD.md.png" alt="h6CMGD.png" border="0" />

<img class="zoom-custom-imgs" src="https://z3.ax1x.com/2021/09/03/h6Zn8P.md.png" alt="h6Zn8P.png" border="0" />

<img class="zoom-custom-imgs" src="https://z3.ax1x.com/2021/09/03/h6NdtP.md.png" alt="h6NdtP.png" border="0" />

测试一下, 将百度的网站中`百度一下`替换成`百度两下`

<img class="zoom-custom-imgs" src="https://z3.ax1x.com/2021/09/03/h6a92T.md.png" alt="h6a92T.png" border="0" />
