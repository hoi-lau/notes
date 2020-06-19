# 用户管理

## 添加用户

useradd或adduser命令用来建立用户帐号和创建用户的起始目录，使用权限是超级用户。

### 区别

useradd是使用系统编译的本机二进制文件。 但是，adduser是一个Perl脚本，它在后端使用useradd二进制文件。

与后端用户add相比，adduser更加用户友好和互动。 提供的功能没有差异。

## 设置密码

passwd

``` shell
passwd liuk
```



## 删除用户

`userdel `

```shell
userdel -r liuk
# 用户主目录中的文件将随用户主目录和用户邮箱一起删除。在其它文件系统中的文件必须手动搜索并删除
```

<b>linux中普通用户登陆权限 /bin/bash, 系统用户 /sbin/nologin</b>