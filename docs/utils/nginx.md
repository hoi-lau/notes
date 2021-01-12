---
title: nginx 配置
categories:
 - utils
publish: false
---

## 配置白名单

```conf
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

## 解析客户端真实ip

```conf
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Real-Port $remote_port;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

