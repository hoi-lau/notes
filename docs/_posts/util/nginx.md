---
title: nginx 配置
category:
 - nginx
publish: false
---

## 配置白名单

```shell
http {
  geo $remote_addr $geo {
    default 0;# 0禁止访问
    127.0.0.1 1;# 1允许访问
  }
  
  server {
    location / {
      if ( $geo = 0 ) {
        return 403;
      }
    }
  }
}
```

