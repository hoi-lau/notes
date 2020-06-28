---
title: tomcat配置
category: 
 - web server
tags:
 - tomcat
---

## 配置访问路径

```xml
<!-- 编辑 conf 目录下的 server.xml 文件
		 在 Host 节点下新增 Context 节点 -->
<Context path="" docBase="wiki" reloadable="true" /> 
<!-- path 为访问时的前缀
		 docBase 项目根目录 eg: wiki 位于 webapps 目录下
		 reloadable 监视文件的变动，重新启动服务器 -->
```

## 修改默认端口

```xml
<!-- http 端口设置 -->
<Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
```

## 配置错误页面

```xml
<!-- 在项目根目录下添加 WEB-INF 文件夹 -->
<!-- 在 WEB-INF 文件夹中新建 server.xml 文件,内容: -->
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
           http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
  version="3.1" metadata-complete="true">
  <error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
  </error-page>
</web-app>

```

