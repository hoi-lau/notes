---
title: 在macos上调试chromium
date: 2021-08-01
categories:
 - web
tags:
 - chromium
---

>在macos上学习调试chromium

## 环境

1. macos catalina 10.15.7
2. xcode12.3

## 拉取代码

### 设置git代理

```sh
git config --global http.proxy 'socks5://127.0.0.1:1089'
git config --global https.proxy 'socks5://127.0.0.1:1089'
# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 安装`depot_tools`

```sh
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
# wait...
```

添加到环境变量

```sh
# gn tools
export PATH=$PATH:/Users/liuk/project/chrome/depot_tools
```

source一下

### 拉取代码

```sh
mkdir chromium && cd chromium && fetch chromium
# 不带历史记录
# fetch --no-history chromium
```

### 同步代码

```sh
gclient sync
gclient runhooks
```

### 开始编译

```sh
gn gen out/chromium
```

## debug with xcode

启动chromium进程

```sh
# path
out/gn/Chromium.app/Contents/MacOS/Chromium
```

使用xcode打开`out/chromium/all.xcodeproj`

debug -> attatch to process -> 选择Chromium 进程

接下来就可以打断点调试了

eg:

chrome>browser>ui>views>tabs>new_tab_button.cc 146行 NotifyClick函数 添加一个断点

在chromium中新开一个tab 就会进入断点了