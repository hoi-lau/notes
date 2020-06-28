---
title: linux常用命令
date: 2019-06-06
---

## 安装

```
// 阿里镜像地址
https://developer.aliyun.com/mirror
```

> U盘  >  16G

> 写入镜像

> 安装系统

> 选择功能

> 启用网络

> 设置管理员

### yum换源

https://developer.aliyun.com/mirror/centos?spm=a2c6h.13651102.0.0.15231b11YXgbPi

配置文件备份

```sh
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
yum makecache
```

### 关闭防火墙

```sh
# 关闭防火墙
service firewalld stop
# 查看防火墙状态
service firewalld status
# 禁止自启动
chkconfig firewalld off
```

### 配置java环境变量

```sh
# --java 环境变量---
# 找到java安装目录
JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64
JRE_HOME=$JAVA_HOME/jre
CLASS_PATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JRE_HOME/lib
PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin
export JAVA_HOME JRE_HOME CLASS_PATH PATH
# -----------------
```

## 用户管理

### 添加用户

useradd或adduser命令用来建立用户帐号和创建用户的起始目录，使用权限是超级用户。

### 区别

useradd是使用系统编译的本机二进制文件。 但是，adduser是一个Perl脚本，它在后端使用useradd二进制文件。

与后端用户add相比，adduser更加用户友好和互动。 提供的功能没有差异。

### 设置密码

passwd

``` shell
passwd liuk
```

### 删除用户

`userdel `

```shell
userdel -r liuk
# 用户主目录中的文件将随用户主目录和用户邮箱一起删除。在其它文件系统中的文件必须手动搜索并删除
```

<b>linux中普通用户登陆权限 /bin/bash, 系统用户 /sbin/nologin</b>

## 备份 & 压缩

### gzip

压缩文件 gzip filename. 不会保留源文件,无法压缩文件大小大于4G的文件

无法压缩目录,递归压缩目录下所有文件 -r

解压: gzip -d

### gunzip

解压缩

### tar

打包命令

tar [option] 压缩后文件名 目录

**在我们读入文件时文件发生了变化**: 一些程序会一直往文件中输出内容,这时可以在打包之前copy一份数据,打包完成之后再删除

-c 打包,**打包时会带上完整目录名**

-v 显示详细信息

-f 指定文件名

-x 解包

-z 打包同时压缩

### zip

压缩. windows linux通用

### unzip

解压缩

## 磁盘

### 扩展磁盘空间(lvm管理)

```shell
# 查看磁盘情况
fdisk -l /dev/sda
# 查看磁盘占用
df -fh
# 创建新分区
fdisk /dev/sda
# n p ... 8e w
reboot
# ...
vgdisplay
# VG Name   cl

# 为新分配的空间创建一个新的物理卷
pvcreate /dev/sda3
# 使用新的物理卷来扩展 LVM 的 VolGroup
vgextend cl /dev/sda3
# 扩展 LVM 的逻辑卷 /dev/cl/home
lvextend  /dev/cl/home  /dev/sda3
xfs_growfs /dev/cl/home
df -fh
```

## 文件管理


### scp -- 安全传输文件

Linux scp 命令用于 Linux 之间复制文件和目录。rcp的安全版.

``` sh
# 本地向目标服务器传输文件
scp local_file remote_username@remote_ip:remote_folder 
# 传输文件夹
scp -r local_file remote_username@remote_ip:remote_folder 
```

### ln -- 创建链接

link

### 软链接

``` sh
ln -s wiki wiki.soft
ls -l
# lrwxrwxrwx 1 liuk liuk ... wiki.soft -> wiki/
```

软链接特点: 权限 `lrwxrwxrwx`

### 硬链接

```sh
ln wiki wiki.hard
```

硬链接特点: 

- `cp -p + 同步更新`
- 可以通过i节点识别  ls -i
- 无法跨分区
- 无法对目录使用

### 查看文件内容 less & more

### less

d向后翻页,b向前翻页

向后查找关键字n,向前查找关键字shift + n

### 查看文件内容 head & tail 

head 查看文件前n行内容

tail 查看文件后n行内容

``` sh
head -n 10 error.log
tail -n 10 error.log
# 默认10行
# tail -f 动态显示文件内容
```

### 文件搜索 -- find locate which whereis

```sh
# 根据文件名查找 -name
# 在当前目录下寻找文件名以error.log结尾的文件
# -iname 不区分大小写
find . -name '*error.log'
# 根据文件数据块大小查找 -size
# linux中一个数据块是 512byte 0.5kb
# + 大于 - 小于  查找当前目录下文件大小大于1kb的文件
find . -size +2 
# 根据文件所有者查找 -user
find . -user liuk
# 根据所属组查找 -group ...

# which, whereis查找命令所在的目录,还可以查找命令的别名
which useradd
whereis useradd
```

## 网络

### write

w查看在线用户

给用户(登陆状态)发信息,CTRL+D保存结束

### wall

write all

给所有在线用户发信息

### ifconfig

yum install -y net-tools

### mail

yum install mailx sendmail

发送邮件

### last

查看过去所有登陆信息

lastlog 查看最近访问时间

### traceroute

显示数据包到主机间的路径

### netstat

显示网络相关信息

- -t tcp
- -u udp
- -l listening
- -r route
- -n ip port

## 进程管理

### sleep

当前进程进入睡眠模式3秒:

```shell
sleep 3
```

-  udelay   纳秒级 

-  ndelay   微秒级 

-  mdelay   毫秒级 

### ps

查看系统进程

```shell
ps -el
ps aux
```

### top

查看系统资源,判断服务器是否健康

### pstree

查看进程树

yum install -y psmisc

### kill

kill -9 pid

强制杀死进程

### killall

killall -9 httpd 杀死apache服务,服务名

### jobs

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

## 系统服务管理

### linux开机顺序

https://www.jianshu.com/p/e1442913eb0e

1. 加载kernel
2. 启动 init(/etc/inittab) 
3. 执行 `/etc/rc.d/rc.sysinit` 
4. 执行 `/etc/rc.d/rc*.d`（rc0.d、rc1.d、rc2.d…rc6.d） 
5. 执行 `/etc/rc.d/rc.local`（就是 /etc/rc.local） 
6. `/sbin/mingetty`，等待用户登录 

### 时间

在Linux运行过程中，系统时间和硬件时间以异步的方式运行，互不干扰。硬件时间的运行，是靠Bios电池来维持，而系统时间，是用CPU tick来维持的。

在系统开机的时候，会自动从Bios中取得硬件时间，设置为系统时间。

#### date

查看或者设置系统时间

```shell
date
# 2020年 05月 04日 星期一 10:51:56 CST
date -s "datestring"
# 设置时间
```

#### hwclock

```shell
#以系统时间为基准，修改硬件时间
hwclock --systohc<== sys（系统时间）to（写到）hc（Hard Clock）
hwclock -w
# 以硬件时间为基准，修改系统时间
hwclock --hctosys
hwclock -s
```

#### ntpdate

通过ntp服务设置时间

```shell
ntpdate -u asia.pool.ntp.org
```

### 系统信息

#### top

进程查看

#### free

查看内存使用

```shell
free -m
# 缓存加速硬盘读取
# 缓冲加速硬盘写入
```

#### uname

查看系统信息

```shell
uname -a 
```

### 定时任务

#### crond

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

### chkconfig

```sh
chkconfig [--level 运行级别] [服务名] [on/off]
```

### rc.local

修改/etc/rc.d/rc.local文件

### service

redhat专有命令

service ... start

### init.d(推荐)

启动脚本绝对路径

/etc/init.d/httpd restart

## utils

### curl

```shell
curl http://192.168.100.76:8002/api/artItem/startFlow  -X POST -H "Content-Type:application/json" -d '{"dataKey": "dataKey","metaData": "metaData"}'


curl http://***.***.**.**/api/api -X POST -d "parameterName1=parameterValue1&parameterName2=parameterValue2"
```

### echo

输出

echo -e 转义字符功能

echo -E 关闭转义字符功能

### ntpdate 

时间管理

yum install ntpdate -y 

ntpdate -u ntp.api.bz 

ntp.ntsc.ac.cn

同步网络时间(上海)