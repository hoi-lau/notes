---
title: 使用github webhook + jenkins持续集成
date: 2020-06-29
categories:
 - utils
tags:
 - jenkins
 - docker
---

## Jenkins

Jenkins是基于java开发的一个免费而强大的持续集成工具，用于监控持续重复的工作。

## 安装jenkins

```sh
# 先拉取镜像, 推荐使用这个镜像
sudo docker pull jenkinsci/blueocean

# 创建容器卷,数据持久化
sudo docker volume create jenkins-docker-certs
sudo docker volume create jenkins-data

# 可选
# 为了在Jenkins节点内执行Docker命令
# 关闭容器后删除容器 --rm
sudo docker network create jenkins
sudo docker run \
  -u root \
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
sudo docker run \
  -u root \
  --rm \
  --name jenkins-blueocean \
  --detach \
  --env DOCKER_HOST=tcp://docker:2376 \
  --env DOCKER_CERT_PATH=/certs/client \
  --env DOCKER_TLS_VERIFY=1 \
  --network jenkins \
  --publish 8080:8080 \
  --volume /data/jenkins_ssh:/root \
  --volume jenkins-data:/var/jenkins_home \
  --volume /var/run/docker.sock:/var/run/docker.sock \
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
cat ~/.ssh/id_rsa.pub
# 将公钥复制到目标服务器用户目录下authorized_keys文件中 ~/.ssh/authorized_keys
# 目标服务器要支持密钥登录
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

### 配置一个freestyle project

配置一个简单的`freestyle project`大致步骤:

1. new item
2. 选择`freestyle project` 
3. 配置源码管理 

<img src="https://s1.ax1x.com/2020/07/05/USh2bq.png" alt="jenkins build triggers" border="0">

4. 配置`github webhook` (项目 -> settings -> add webhooks -> payload 填上`jenkins`服务器地址). 配置后每次 push 代码到github, github 都会发送一个 post 请求到 jenkins 服务器, jenkins 服务器就会去构建 job, 所以 jenkins 服务器必须是外网可以访问的(或者是 git 服务器可以访问到的).

最后配置要执行的 shell

### 配置一个pipeline

`jenkins pipeline`是一套插件，将持续交付的实现和实施集成到 `Jenkins` 中。 在项目根目录中新建文件`Jenkinsfile`,

```groovy
pipeline {
    agent { docker 'maven:3.3.3' }
    stages {
        stage('build') {
            steps {
                sh 'mvn --version'
            }
        }
    }
}
```

#### agent

 `agent` 部分指定了整个流水线或特定的部分, 将会在Jenkins环境中执行的位置，这取决于 `agent` 区域的位置。该部分必须在 `pipeline` 块的顶层被定义, 但是 stage 级别的使用是可选的。 

##### 参数

为了支持作者可能有的各种各样的用例流水线, `agent` 部分支持一些不同类型的参数。这些参数应用在`pipeline`块的顶层, 或 `stage` 指令内部。

- any

  在任何可用的代理上执行流水线或阶段。例如: `agent any`

- none

  当在 `pipeline` 块的顶部没有全局代理， 该参数将会被分配到整个流水线的运行中并且每个 `stage` 部分都需要包含他自己的 `agent` 部分。比如: `agent none`

- label

  在提供了标签的 Jenkins 环境中可用的代理上执行流水线或阶段。 例如: `agent { label 'my-defined-label' }`

- node

  `agent { node { label 'labelName' } }` 和 `agent { label 'labelName' }` 一样, 但是 `node` 允许额外的选项 (比如 `customWorkspace` )。

- docker

  使用给定的容器执行流水线或阶段。该容器将在预置的 `node`上，或在匹配可选定义的`label` 参数上，动态的供应来接受基于Docker的流水线。 `docker` 也可以选择的接受 `args` 参数，该参数可能包含直接传递到 `docker run` 调用的参数, 以及 `alwaysPull` 选项, 该选项强制 `docker pull` ，即使镜像名称已经存在。 比如: `agent { docker 'maven:3-alpine' }` 或`agent {    docker {        image 'maven:3-alpine'        label 'my-defined-label'        args  '-v /tmp:/tmp'    } }`

- dockerfile

  执行流水线或阶段, 使用从源代码库包含的 `Dockerfile` 构建的容器。为了使用该选项， `Jenkinsfile` 必须从多个分支流水线中加载, 或者加载 "Pipeline from SCM." 通常，这是源代码仓库的根目录下的 `Dockerfile` : `agent { dockerfile true }`. 如果在另一个目录下构建 `Dockerfile` , 使用 `dir` 选项: `agent { dockerfile {dir 'someSubDir' } }`。如果 `Dockerfile` 有另一个名称, 你可以使用 `filename` 选项指定该文件名。你可以传递额外的参数到 `docker build ...` 使用 `additionalBuildArgs` 选项提交, 比如 `agent { dockerfile {additionalBuildArgs '--build-arg foo=bar' } }`。 例如, 一个带有 `build/Dockerfile.build` 的仓库,期望一个构建参数 `version`:`agent {    // Equivalent to "docker build -f Dockerfile.build --build-arg version=1.0.2 ./build/    dockerfile {        filename 'Dockerfile.build'        dir 'build'        label 'my-defined-label'        additionalBuildArgs  '--build-arg version=1.0.2'    } }`

##### 常见选项

有一些应用于两个或更多 `agent` 的实现的选项。

- label

  一个字符串。该标签用于运行流水线或个别的 `stage`。该选项对 `node`, `docker` 和 `dockerfile` 可用, `node`要求必须选择该选项。

- customWorkspace

  一个字符串。在自定义工作区运行应用了 `agent` 的流水线或个别的 `stage`, 而不是默认值。 它既可以是一个相对路径, 在这种情况下，自定义工作区会存在于节点工作区根目录下, 或者一个绝对路径。比如:`agent {    node {        label 'my-defined-label'        customWorkspace '/some/other/path'    } }`该选项对 `node`, `docker` 和 `dockerfile` 有用 。

- reuseNode

  一个布尔值, 默认为false。 如果是true, 则在流水线的顶层指定的节点上运行该容器, 在同样的工作区, 而不是在一个全新的节点上。这个选项对 `docker` 和 `dockerfile` 有用, 并且只有当 使用在个别的 `stage` 的 `agent` 上才会有效。

##### 示例

```groovy
pipeline {
    agent { docker 'maven:3-alpine' } 
    stages {
        stage('Example Build') {
            steps {
                sh 'mvn -B clean verify'
            }
        }
    }
}
```

###### 阶段级别的 `agent` 部分



```groovy
pipeline {
    agent none 
    stages {
        stage('Example Build') {
            agent { docker 'maven:3-alpine' } 
            steps {
                echo 'Hello, Maven'
                sh 'mvn --version'
            }
        }
        stage('Example Test') {
            // 可以用来区分多个分支
            //when {
            //    branch 'dev' 
            //}
            agent { docker 'openjdk:8-jre' } 
            steps {
                echo 'Hello, JDK'
                sh 'java -version'
            }
        }
    }
}
```

### 