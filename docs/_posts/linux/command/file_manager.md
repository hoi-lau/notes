

# 文件管理相关命令


## scp -- 安全传输文件

Linux scp 命令用于 Linux 之间复制文件和目录。rcp的安全版.

``` shell
# 本地向目标服务器传输文件
scp local_file remote_username@remote_ip:remote_folder 
# 传输文件夹
scp -r local_file remote_username@remote_ip:remote_folder 
```

## ln -- 创建链接

link

### 软链接

``` shell
ln -s wiki wiki.soft
ls -l
# lrwxrwxrwx 1 liuk liuk ... wiki.soft -> wiki/
```

软链接特点: 权限 `lrwxrwxrwx`

### 硬链接

```shell
ln wiki wiki.hard
```

硬链接特点: 

- `cp -p + 同步更新`
- 可以通过i节点识别  ls -i
- 无法跨分区
- 无法对目录使用

## 查看文件内容 less & more

### less

d向后翻页,b向前翻页

向后查找关键字n,向前查找关键字shift + n

## 查看文件内容 head & tail 

head 查看文件前n行内容

tail 查看文件后n行内容

``` shell
head -n 10 error.log
tail -n 10 error.log
# 默认10行
# tail -f 动态显示文件内容
```

## 文件搜索 -- find locate which whereis

```shell
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

