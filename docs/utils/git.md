---
title: git常用命令
date: 2018-08-15
categories:
 - utils
tags:
 - git
publish: false
---

> 生成公私钥: ssh-keygen -o -t rsa -b 4096 -C "im.liukai2333@gmail.com"

*1*. ` git init `初始化当前文件夹,(.git目录),该文件夹下所有文件都可以被git管理

*2*. ` git add your_file `添加到git仓库暂存区,取消暂存:` git reset HEAD file`

*3*. ` git commit -m 'help' `将添加到git仓库的文件提交,把暂存区的所有修改提交(--amend) 这个命令会将暂存区中的文件提交。 如果自上次提交以来你还未做任何修改（例如，在上次提交后马上执行了此命令），那么快照会保持不变，而你所修改的只是提交信息 

*4*. ` git status `查看当前仓库状态

*5*. ` git log (--pretty=oneline) `查看git日志

*6*. ` git reset --hard HEAD~n `回到上n个版本(回到未来版本git reset --hard 版本号(前几位就行+Tab))

*7*. ` git reflog `记录每一次命令和版本号

*8*. ` git checkout -- filename `废弃file在工作区的修改

*9*. ` git remote add origin git@github.com:usernameliukai/clearAD.git ` 关联远程库

*10*. ` git pull  origin master `第一次提交先pull 然后git push origin master....

*11*. ` git rm (-r) xx  `删除目录/文件  --cache 只删除git仓库中的,保留本地

*12*. ` git reset --merge   `

*13*. 强制push的方法： ` $ git push -u origin master -f `

*14* . ` git push --set-upstream origin dev-liuk `第一次提交分支

*15*. 为commit加上标签 ` git tag -a v1.0 -m "ababa"`, 标签默认打在最新的commit上,为某次commit打标签 `git tag v0.9 f52c633`, 将标签推送,` git push origin v1.0(--tags 推送全部标签)`

*16*. 生成ssh key`ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`

*17*. 查看分支图` git log --oneline --decorate --graph --all `

*18*.  `git merge --no-ff FETCH_HEAD`

## git分支

 Git 的分支，其实本质上仅仅是指向提交对象的可变指针.由于 Git 的分支实质上仅是包含所指对象校验和（长度为 40 的 SHA-1 值字符串）的文件，所以它的创建和销毁都异常高效。 

`git push --set-upstream origin dev`

git clone时提示不支持https:删除clone后的空格然后补全

常用技巧

## .gitignore示例

```
# package files
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar
target/

# Compiled class file
*.class

# Log file
*.log

# Gradle Files
.gradle/
gradle/
/build/
!gradle/wrapper/gradle-wrapper.jar

# IntelliJ IDEA
.idea/
*.iws
*.iml
*.ipr
/out/

.mvn
# ignore eclipse files
.project
.classpath
.settings
.metadata

# node modules
package-lock.json
yarn.lock
node_modules/

# MacOS folder file
.DS_Store

```

