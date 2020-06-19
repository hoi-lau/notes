# jenkins

使用`docker`安装

```sh
# 先拉取镜像, 推荐使用这个镜像
docker pull jenkinsci/blueocean

# 创建容器卷
sudo docker volume create jenkins-docker-certs
sudo docker volume create jenkins-data

# 可选
# 为了在Jenkins节点内执行Docker命令，请docker:dind使用以下docker container run 命令下载并运行Docker映像
# 关闭容器后删除容器 --rm \
docker container run \
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
sudo docker container run \
  --name jenkins-blueocean \
  --detach \
  --env DOCKER_CERT_PATH=/certs/client \
  --env DOCKER_TLS_VERIFY=1 \
  --publish 8011:8080 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  jenkinsci/blueocean
```

## 安装插件过慢

解决办法: 更改Jenkins 插件源为国内的镜像源 

jenkins->系统管理->管理插件->高级--> 升级站点

http://mirror.esuni.jp/jenkins/updates/update-center.json

镜像源查询网址: http://mirrors.jenkins-ci.org/status.html#cn

