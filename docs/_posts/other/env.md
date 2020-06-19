## cmd

1.查看所有环境变量：set

2.设置环境变量：set MyEnvTest=D:\res

3.set查看某个或某类环境变量：set MyEnvTest

 输出结果：MyEnvTest=D:\res

4.echo查看某个环境变量：echo %MyEnvTest%

 输出结果：D:\res

5.修改环境变量值：set MyEnvTest=%MyEnvTest%;D:\apk

6.删除某个环境变量：set MyEnvTest=

## gitbash

### 设置 CLASSPATH

$ export CLASSPATH="/d/program/JavaTrainning/src"

### 查看 CLASSPATH

$ echo $CLASSPATH

### 输出

$ /d/program/JavaTrainning/sr