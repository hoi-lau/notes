---
title: 仓库存储--nexus
publish: false
date: 2020-07-31
---

## install 

```sh
docker volume create nexus-repo
docker run --rm -d -p 8081:8081 --name=nexus --privileged=true  -v nexus-repo:/var/nexus-data sonatype/nexus3:latest
```

## npm仓库

## maven仓库

