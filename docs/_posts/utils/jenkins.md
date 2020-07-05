---
title: 使用github webhook + jenkins自动部署
date: 2020-06-29
categories:
 - utils
tags:
 - jenkins
 - docker
---

> 日常开发完后都要打包手动上传到服务器,当修改过于频繁时,费时费力还容易出错,为了解放我的双手👐,花了两天时间研究了一下自动部署,旨在提交代码后自动完成测试,打包,部署,以及反馈结果.

## Jenkins是什么

Jenkins是基于java开发的一个免费而强大的持续集成工具，用于监控持续重复的工作，旨在提供一个开放易用的软件平台，使软件的持续集成变成可能。

## 安装jenkins

```sh
# 先拉取镜像, 推荐使用这个镜像
docker pull jenkinsci/blueocean

# 创建容器卷,数据持久化
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

manage jenkins->系统管理->管理插件->高级-> 升级站点-> 将默认源更换为以下网址

http://mirror.esuni.jp/jenkins/updates/update-center.json

镜像源查询网址: http://mirrors.jenkins-ci.org/status.html#cn

### 安装插件

- Publish Over SSH
- NodeJs

**配置ssh server**

进入Jenkins容器生成密钥

```sh
docker exec -it jenkins-blueocean sh
ssh-keygen -t rsa -b 4096 -m PEM
cat ~/ssh/id_rsa.pub
# 将公钥复制到目标服务器用户目录下authorized_keys文件中 ~/.ssh/authorized_keys
# 目标服务器要支持私钥登录
cat ~/.ssh/id_rsa
# 复制私钥
```

manage Jenkins->configure system->找到 Publish over SSH

<img src="https://s1.ax1x.com/2020/07/05/UShWV0.png" alt="jenkins ssh server" border="0">

> 配置ssh server完成后测试连接出现错误: ssh remote & invalid privatekey
>
> 发现是插件Publish Over SSH不支持新的openssh格式密钥.[见issue]( https://issues.jenkins-ci.org/browse/JENKINS-57495 )

**配置nodejs环境**

manage jenkins-> global tool configuration

<img src="https://s1.ax1x.com/2020/07/05/UShfaV.png" alt="jenkins nodejs" border="0">

jenkins会自动配置nodejs环境

> 如果构建过程中出现错误sh node command not found.可以手动安装node
>
> apk add nodejs
>
> apk add npm

## 配置job

选择freestyle project-> 配置源码管理 ->

<img src="https://s1.ax1x.com/2020/07/05/USh2bq.png" alt="jenkins build triggers" border="0">

-> 配置github webhook(项目->settings->add webhooks->payload填上jenkins服务器地址).配置后每次push代码到github,github都会发送一个post请求到jenkins服务器,jenkins服务器就会去构建job,所以jenkins服务器必须是外网可以访问的(或者是git服务器可以访问到的).

最后配置要执行的shell