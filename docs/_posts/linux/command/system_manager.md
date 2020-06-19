# 系统管理

## linux开机顺序

https://www.jianshu.com/p/e1442913eb0e

1. 加载kernel
2.  启动 init(/etc/inittab) 
3.  执行 `/etc/rc.d/rc.sysinit` 
4.  执行 `/etc/rc.d/rc*.d`（rc0.d、rc1.d、rc2.d…rc6.d） 
5.  执行 `/etc/rc.d/rc.local`（就是 /etc/rc.local） 
6.  `/sbin/mingetty`，等待用户登录 

## 时间

在Linux运行过程中，系统时间和硬件时间以异步的方式运行，互不干扰。硬件时间的运行，是靠Bios电池来维持，而系统时间，是用CPU tick来维持的。

在系统开机的时候，会自动从Bios中取得硬件时间，设置为系统时间。

### date

查看或者设置系统时间

```shell
date
# 2020年 05月 04日 星期一 10:51:56 CST
date -s "datestring"
# 设置时间
```

### hwclock

```shell
#以系统时间为基准，修改硬件时间
hwclock --systohc<== sys（系统时间）to（写到）hc（Hard Clock）
hwclock -w
# 以硬件时间为基准，修改系统时间
hwclock --hctosys
hwclock -s
```

### ntpdate

通过ntp服务设置时间

```shell
ntpdate -u asia.pool.ntp.org
```

## 系统信息

### top

进程查看

### free

查看内存使用

```shell
free -m
# 缓存加速硬盘读取
# 缓冲加速硬盘写入
```

### uname

查看系统信息

```shell
uname -a 
```

## 定时任务

### crond

```shell
# 查看当前用户定时任务
crondtab -l
# 编辑当前用户定时任务
crontab -e

# 第一个*: 每个小时的第几分钟 0-59
# 第二个*: 一天中的第几个小时 0-23
# 第三个*: 一个月的第几天 1-31
# 第四个*: 一年中的第几个月 1-12
# 第五个*: 一周的星期几 0-7
# , 代表不连续的时间
# - 代表连续的时间
# */n 代表每隔多久执行一次命令,最小单位是1分钟

# 每隔10分钟向test文件中写入"test"
*/10 * * * * /bin/echo "test">>/tmp/test
# 每天0点0分执行bak.sh脚本
0 0 * * * /home/liuk/bak.sh

# 在定时任务脚本中定义日期需要加上转义符
date=$(date +\%y\%m\%d)
```

