---
title:  使用vscode 搭建 typescript 的nodejs 自动编译自动启动服务
publish: false
---

依赖

```json
{
    "dependencies": {
        "@types/node": "^13.13.5"
    },
    "devDependencies": {
        "ts-node": "^8.10.1",
        "typescript": "^3.8.3"
    }
}
```

tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "outDir": "../build",
    "sourceMap" : true,
    "lib": [
      "es6"
    ]
  },
  "include": [
    "../src/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}\\build\\index.js",
      "protocol": "inspector"
    }
  ]
}
```

task.json

```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "typescript",
			"tsconfig": "config/tsconfig.json",
			"problemMatcher": [
				"$tsc"
			],
			"group": "build",
			"label": "tsc: build - config/tsconfig.json"
		}
	]
}
```

