---
title: docker学习
date: 2020-05-05
categories:
 - utils
tags:
 - docker
---

## 安装docker(centos)

```shell
yum update
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
sudo yum makecache fast
sudo yum -y install docker-ce
sudo service docker start
# 安装docker-compose
sudo yum install -y epel-release
sudo yum install -y docker-compose 
```

### 配置国内镜像

https://cr.console.aliyun.com/

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://i4pn7k4g.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

跟随系统启动

```shell
$ systemctl enable docker
```

## concept

### image

docker镜像是一个<b>只读</b>模板,可以用来创建容器

docker pull  ubuntu:12.04 

获取镜像

### container

Docker 利用容器来运行应用。

容器是从镜像创建的运行实例。它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证安全的平台。

可以把容器看做是一个简易版的 Linux 环境（包括root用户权限、进程空间、用户空间和网络空间等）和运行在其中的应用程序。

### repository

类似git仓库

## 常用命令

### 镜像

```shell
# 查找镜像
docker search node
# pull镜像到本地,默认会拉取最新的版本,指定版本node:10
docker pull node
# 删除镜像
docker rmi image-id
# 如果删除镜像已经被其他镜像依赖,则无法删除
# 查看依赖项since=images_id
docker image inspect --format='{{.RepoTags}} {{.Id}} {{.Parent}}' $(docker image ls -q --filter since=a02c9f46f94a)

# 列出本地镜像
docker images

# 根据dockerfile创建一个镜像
docker build -t microscope .
# -t 添加标记 . 表示dockerfile所在目录
```

### 虚悬镜像

 镜像既没有仓库名，也没有标签 , 均为none

 一般来说，虚悬镜像已经失去了存在的价值，是可以随意删除的，可以用下面的命令删除。 

```sh
docker image prune
```

### 定制镜像

#### commit(慎用)

**`docker commit`命令有一些特殊的应用场合，比如被入侵后保存现场等.** 

- 无法重复
- 镜像构建不透明
- 体积太大

```shell
$ docker commit \
    --author "Tao Wang <twang2218@gmail.com>" \
    --message "修改了默认网页" \
    webserver \
    nginx:v2
# sha256:07e33465974800ce65751acc279adc6ed2dc5ed4e0838f8b86f0c87aa1795214
```

#### Dockerfile(推荐)

将所有 修改、安装、构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像，那么之前提及的无法重复的问题、镜像构建透明性的问题、体积的问题就都会解决。这个脚本就是 Dockerfile。 

**每一个`docker`指令都会构建一层镜像**

**from**指定镜像

```shell
FROM nginx
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
# FROM scratch表示不以任何镜像为基础
# 撰写 Dockerfile 的时候，要经常提醒自己，这并不是在写 Shell 脚本，而是在定义每一层该如何构建
```

#### 构建镜像

```shell
docker build [选项] <上下文路径/URL/->
# 上下文路径!!!
# -f 指定dockerfile文件,默认是当前路径Dockerfile
```

### 新建并启动容器

```shell
docker run [options] --name container_name  image_id
# --privileged=true 授权
```

-d: 后台运行容器

-i: 以交互模式运行

-t: 为容器分配一个伪终端

-P: 随机端口映射

-p: 指定端口映射

--rm: 容器退出后删除容器

### 退出容器

`exit` 容器停止退出

<div style="color:red">`ctrl + p + q` 容器不停止退出</div>
### 查看运行的容器

```shell
docker ps [options]
```

### 容器

<b> 对于容器而言，其启动程序就是容器应用进程，容器就是为了主进程而存在的，主进程退出，容器就失去了存在的意义，从而退出，其它辅助进程不是它需要关心的东西。(要有前台任务!!!) </b>

```shell
# 停止容器
docker stop container_id or container_name
# 强制停止容器
docker kill container_id or container_name

# 启动容器
docker start container_id or container_name
# 重启容器
docker restart container_id or container_name
# 删除容器
docker rm container_id or container_name
# 删除多个容器
docker rm -f $(docker ps -a -q)

# 导出镜像到本地文件
docker save -o ubuntu_14.04.tar ubuntu:14.04
# 载入本地镜像
docker load --input ubuntu_14.04.tar

# attach 进入运行的容器,不推荐
# 使用 attach 命令有时候并不方便。当多个窗口同时 attach 到同一个容器的时候，所有窗口都会同步显示。当某个窗口因命令阻塞时,其他窗口也无法执行操作了。
docker attach container_name

# exec 在正在运行的容器中运行命令
# 进入Ubuntu并建立一个shell环境
# -u root 获取root权限
docker exec -it ubuntu_bash /bin/bash

# 导出容器快照到本地
docker export container_id > container.tar

# 导入容器快照
```

## Dockerfile

 Dockerfile 是一个用来构建镜像的文本文件，文本内容包含了一条条构建镜像所需的指令和说明。 

**Dockerfile 的指令每执行一次都会在 docker 上新建一层。所以过多无意义的层，会造成镜像膨胀过大**

### FROM

 定制的镜像都是基于 FROM 的镜像 

### RUN

 用于执行后面跟着的命令行命令 

有以下俩种格式：

shell 格式：

```shell
RUN <命令行命令>
# <命令行命令> 等同于，在终端操作的 shell 命令。
```

exec 格式：

```shell
RUN ["可执行文件", "参数1", "参数2"]
# 例如：
# RUN ["./test.php", "dev", "offline"] 等价于 RUN ./test.php dev offline
```

### COPY

类似ADD,拷贝文件或者目录到镜像中

### ADD

将宿主机的文件拷贝进镜像,会自动解压缩包

### CMD(覆盖)

指定一个容器启动要运行的命令,一个dockerfile可以有多个CMD指令,但只会有最后一个会生效.且会被命令行参数替代

### ENTRYPOINT(追加)

指定一个容器启动要运行的命令

### ENV

指定环境变量

### ARG

### VOLUME

容器数据卷,持久化

### EXPOSE

向外暴露的端口

### WORKDIR

指定的容器创建后,默认的工作目录

### USER

### HEALTHCHECK

### ONBUILD

当父镜像被子镜像继承后触发

### MAINTAINER

镜像维护者的姓名邮箱

## 使用docker

### 安装mysql

```sh
docker search mysql
# 在dockerhub上查找版本
docker pull mysql:$version
# -p 端口映射 --name 容器别名 -v 挂载卷
docker run -p 3306:3306 --name mysql -v $PWD/conf:/etc/mysql/conf.d -v $PWD/logs:/logs -v $PWD/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql
# 进入交互式终端
docker exec -it mysql /bin/bash
mysql -uroot -p
#123456
GRANT ALL ON *.* TO 'root'@'%';
flush privileges;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
flush privileges;

```

### 安装nginx

```sh
# 宿主机如果nginx配置文件与容器nginx不一致将无法挂载配置文件
# 所以要先将容器内/etc/nginx/nginx.conf 拷贝到宿主机/data/nginx/nginx.conf
docker run -p 80:80 --name nginx -v /data/nginx/www:/usr/share/nginx/html -v /data/nginx/nginx.conf:/etc/nginx/nginx.conf -v /data/nginx/logs:/var/log/nginx -d nginx
```



## docker网络

## 遇到过的问题

### docker: Error response from daemon...

docker: Error response from daemon: driver failed programming external connectivity on endpoint

启动一个容器时报错.原因:

> docker服务启动时定义的自定义链DOCKER由于某种原因被清掉,*重启docker*服务及可重新生成自定义链DOCKER,遇到问题无法解决时,重启试一下.

