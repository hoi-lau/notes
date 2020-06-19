# command

## echo

输出命令

-e: 支持反斜线控制的字符转换(转义字符)

| 控制字符 | 用途                 |
| -------- | -------------------- |
| \ \      | \                    |
| \a       | 输出警告音           |
| \b       | 退格                 |
| \c       | 取消输出行末的换行符 |
| \e       | ESCAPE键             |
| \f       | 换页                 |
| \n       | 换行                 |
| \r       | 回车                 |
| \t       | 制表                 |
| \v       | 垂直制表             |
| \0nnn    | ACSII码              |

## cut

字段提取命令,常用选项

-d 分割符,默认是制表符(ctrl v tab)

-f 第几列 1,3

对空格不友好

## printf

格式化输出数据

```shell
$ printf '%s %s\n' 1 2 3 4 5 6
1 2
3 4
5 6
```

## awk

常用截取指定的列

```shell
# awk '条件1{action}条件2{action}' filename
# 截取第2列,第5列 $0代表所有
awk '{printf $2 "\t" $5 "\n"}' error.log
# 如果需要加入分隔符 FS: linux分隔符
awk 'BEGIN{FS=":"}{}'
# 后置通知END
```

## sed

对数据行选取,替换,删除,新增.可以配合管道符,可以改变文件内容(-i)

<b>不加行号代表所有</b>

```shell
sed -n '2p' study.txt
# 输出第二行内容 print
sed '2a hello' study.txt
# 追加 add
sed '2i hello' study.txt
# 插入 insert

# 替换内容
# c替换整行
sed '2c hello' study.txt
# s替换字符串, 将第二行99替换成98
sed '2c/99/98/g' study.txt
```

## test

用于条件判断

```shell
test -e  /root/install.log
# 判断文件是否存在 [ -e /root/install.log]
```

## pushd & popd

```shell
# pushd 切换目录并将目录压进栈.
pushd /opt/data
pushd +2
# dirs -p 可以查看栈
popd
# popd 出栈并切换到栈顶目录
```

