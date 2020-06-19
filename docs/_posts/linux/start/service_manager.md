# linux服务管理

## chkconfig

```shell
chkconfig [--level 运行级别] [服务名] [on/off]
```

## rc.local

修改/etc/rc.d/rc.local文件

## service

redhat专有命令

service ... start

## init.d(推荐)

启动脚本绝对路径

/etc/init.d/httpd restart