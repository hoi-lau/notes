---
title: 仓库存储--nexus
publish: false
date: 2020-07-31
---

## install 

```sh
sudo docker volume create nexus-repo
sudo docker volume create nexus-data
sudo docker run --rm -d -p 7777:8081  --name=nexus --privileged=true  -v nexus-data:/nexus-data sonatype/nexus3:latest
```

## npm仓库

## maven仓库

