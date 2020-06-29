---
title: 使用github webhook + jenkins持续集成
date: 2020-06-29
categories:
 - ci
tags:
 - jenkins
 - docker
publish: false
---

> 前端项目每次都要打包后手动上传到服务器,当修改过于频繁时,实在是一种折磨,为了解放我的双手👐,花了点时间将Jenkins部署到服务器上.

## Jenkins是什么

Jenkins是基于java开发的一个免费而强大的持续集成工具，用于监控持续重复的工作，旨在提供一个开放易用的软件平台，使软件的持续集成变成可能。

## 安装jenkins

```sh
# 先拉取镜像, 推荐使用这个镜像
docker pull jenkinsci/blueocean

# 创建容器卷
sudo docker volume create jenkins-docker-certs
sudo docker volume create jenkins-data

# 可选
# 为了在Jenkins节点内执行Docker命令，请docker:dind使用以下docker container run 命令下载并运行Docker映像
# 关闭容器后删除容器 --rm \
docker network create jenkins
docker container run \
  --rm \
  --name jenkins-docker \
  --detach \
  --privileged \
  --network jenkins \
  --network-alias docker \
  --env DOCKER_TLS_CERTDIR=/certs \
  --volume jenkins-docker-certs:/certs/client \
  --volume jenkins-data:/var/jenkins_home \
  --publish 2376:2376 \
  docker:dind
# 运行Jenkins容器 --env DOCKER_HOST=tcp://docker:2376 \  --publish 50000:50000 \ --network jenkins \
docker container run \
  -u root \
  --rm \
  --name jenkins-blueocean \
  --detach \
  --env DOCKER_CERT_PATH=/certs/client \
  --env DOCKER_TLS_VERIFY=1 \
  --publish 8011:8080 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  jenkinsci/blueocean
```

## 插件

Jenkins的强大离不开插件的支持

### 更改Jenkins 插件源为国内的镜像源 

jenkins->系统管理->管理插件->高级-> 升级站点-> 将默认源更换为以下网址

http://mirror.esuni.jp/jenkins/updates/update-center.json

镜像源查询网址: http://mirrors.jenkins-ci.org/status.html#cn

### 安装插件

- Publish Over SSH
- NodeJs

配置ssh server

#### ssh remote & invalid privatekey

可能是密钥格式问题

生成Jenkins容器密钥

```sh
ssh-keygen -t rsa -b 4096 -m PEM
```

如果你的私钥有如下开头

> -----BEGIN OPENSSH PRIVATE KEY-----

它意味着` newer OpenSSH format `, Jenkins 无法识别这种格式私钥.

正确的格式应该是这样

> -----BEGIN RSA PRIVATE KEY-----

[issue]( https://issues.jenkins-ci.org/browse/JENKINS-57495 )