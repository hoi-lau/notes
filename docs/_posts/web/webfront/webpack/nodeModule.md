### process:

`process` 对象是一个全局变量，它提供有关当前 Node.js 进程的信息并对其进行控制。 作为一个全局变量，它始终可供 Node.js 应用程序使用，无需使用 `require()`。

`process.env` 属性返回包含用户环境的对象

用 `  process.env.NODE_ENV` 来判断当前环境

### __dirname:

当前模块的目录名