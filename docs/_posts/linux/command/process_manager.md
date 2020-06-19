# 进程控制

## sleep

当前进程进入睡眠模式3秒:

```shell
sleep 3
```

-  udelay   纳秒级 

-  ndelay   微秒级 

-  mdelay   毫秒级 

## ps

查看系统进程

```shell
ps -el
ps aux
```

## top

查看系统资源,判断服务器是否健康

## pstree

查看进程树

yum install -y psmisc

## kill

kill -9 pid

强制杀死进程

## killall

killall -9 httpd 杀死apache服务,服务名

## jobs

查看后台运行程序

```shell
# 将程序放到后台执行
bg 作业号
# 前台执行
fg 作业号

#  >/dev/null  2>&1
nohup ... >/dev/null  2>&1 &
# 后台不间断运行
```

