# aop

开启aop: 配置文件中  spring.aop.auto = true

## 5种通知类型

1. <b>前置通知</b>  在连接点前面执行，前置通知不会影响连接点的执行，除非此处抛出异常。
2. <b>正常返回通知</b>  在连接点正常执行完成后执行，如果连接点抛出异常，则不会执行。
3. <b>异常返回通知</b>  在连接点抛出异常后执行。 
4. <b>返回通知</b>  在连接点执行完成后执行，不管是正常执行完成，还是抛出异常，都会执行返回通知中的内容。 
5. <b>环绕通知</b>  环绕通知围绕在连接点前后，比如一个方法调用的前后。这是最强大的通知类型，能在方法调用前后自定义一些操作。环绕通知还需要负责决定是继续处理join point(调用ProceedingJoinPoint的proceed方法)还是中断执行。

#### ProceedingJoinPoint

只能在环绕通知中使用