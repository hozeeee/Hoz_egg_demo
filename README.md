
# 说明

此项目是本人学习做笔记的项目。

大部分目录都有 README.md 文件，用于说明该目录的作用。

# egg

创建模板项目：

- `npm init egg --type=simple`: 默认最简单的项目
- `npm init egg --type=ts`: 可以创建基于 typescript 的项目

以 ts 项目结构为例：

``` txt
egg-project
├─ app
│  ├─ router.ts         // 路由配置
│  ├─ controller        // 控制器(处理请求)
│  ├─ service           // (可选)用于编写业务逻辑层
│  ├── middleware       // (可选)中间件
│  ├── schedule         // (可选)定时任务
│  ├── public           // (可选)存放静态资源
│  ├── view             // (可选)页面的模板文件
│  ├── model            // (可选)存放领域模型 https://github.com/eggjs/egg-sequelize
│  └── extend           // (可选)框架的扩展 TODO:https://eggjs.org/zh-cn/basics/extend.html
│      ├── helper.* (可选)
│      ├── request.* (可选)
│      ├── response.* (可选)
│      ├── context.* (可选)
│      ├── application.* (可选)
|      └── agent.* (可选)
│
├─ config               // 针对不同环境的配置文件 (除了config.default和config.prod,其他都是可选的)
│  ├─ config.default.ts
│  ├─ config.local.ts
│  ├─ config.prod.ts
│  └─ plugin.ts         // egg的插件配置
│
├─ test                 // 单元测试
│  └─ app
│      ├─ controller
│      │   └─ home.test.ts
│      └─ service
│          └─ Test.test.ts
│
├── app.js              // (可选)当需要自定义启动脚本时才需要书写
├── agent.js            // (可选)
├─ .autod.conf.js
├─ .eslintignore
├─ .eslintrc
├─ .gitignore
├─ package.json
├─ README.md
└─ tsconfig.json

│
├─ typings            // 不能改动!!!自动生成!
│  └─ **/*
│
```

项目结构是有严格规定的，不能随意修改，因为 egg 就是根据目录结构，对 `ctx` 注入对象。

## 运行环境

通过 `EGG_SERVER_ENV` 环境变量指定运行环境，如 `EGG_SERVER_ENV=prod npm start`。

框架默认支持的运行环境及映射关系（如果未指定 EGG_SERVER_ENV 会根据 NODE_ENV 来匹配）：

| NODE_ENV   | EGG_SERVER_ENV | 说明         |
|:-----------|:---------------|:-------------|
|            | local          | 本地开发环境 |
| test       | unittest       | 单元测试     |
| production | prod           | 生产环境     |

如果需要自定义环境，例如，要为开发流程增加集成测试环境 SIT：

- 将 `EGG_SERVER_ENV` 设置成 `sit`
- 并建议设置 `NODE_ENV = production`
- 配置 `config/config.sit.js`

## 框架内置基础对象

具体请看[官网](https://eggjs.org/zh-cn/basics/objects.html)，下面大概介绍。

主要有如下几个：

- 此应用的对象: `app`
- 请求上下文，包括请求和响应，是请求级别的对象: `ctx`
- 请求对象，是请求级别的对象: `ctx.request`
- 响应对象，是请求级别的对象: `ctx.response`
- 常用函数的封装: `ctx.helper`
- 日志功能: `logger.debug()`、`logger.info()`、`logger.warn()`、`logger.error()`
  - 应用级别的日志，与请求无关，使用 `app.logger`
  - 一般我们在开发应用时都不使用，框架和插件才需要通过 `app.coreLogger` 来打印应用级别的日志
  - 请求级别的日志，使用 `ctx.logger`

## 工具

`egg-bin`:

- 模块只在本地开发和单元测试使用。
- `egg-bin dev --port 7001` 启动应用默认监听 7001 端口。
- `egg-bin test` 运行[**单元测试**](./test)。
- `egg-bin test` 运行**调试**，具体说明看[官方介绍](https://eggjs.org/zh-cn/core/development.html#%E4%BD%BF%E7%94%A8-egg-bin-%E8%B0%83%E8%AF%95)，里面包含了如 VScode 等工具的调试办法。

## 启动部署

**启动命令** `$ egg-scripts start --port=7001 --daemon --title=egg-server-showcase`，支持如下参数：

- `--port=7001` **端口号**，默认会读取环境变量 process.env.PORT，如未传递将使用框架内置端口 7001。
- `--daemon` 是否允许在**后台模式**，无需 `nohup`。若使用 Docker 建议直接前台运行。
- `--env=prod` 框架**运行环境**，默认会读取环境变量 `process.env.EGG_SERVER_ENV`，如未传递将使用框架内置环境 `prod`。
- `--workers=2` 框架 **worker 线程数**，默认会创建和 CPU 核数相当的 app worker 数，可以充分的利用 CPU 资源。
- `--title=egg-server-showcase` 用于方便 ps 进程时 grep 用，默认为 `egg-server-${appname}`。
- `--framework=yadan` 如果应用使用了自定义框架，可以配置 `package.json` 的 `egg.framework` 或指定该参数。
- `--ignore-stderr` 忽略启动期的报错。
- `--https.key` 指定 **HTTPS** 所需**密钥文件**的完整路径。
- `--https.cert` 指定 **HTTPS** 所需**证书文件**的完整路径。
- 所有 egg-cluster 的 Options 都支持透传，如 `--port` 等。
- 更多参数可查看 [egg-scripts](https://github.com/eggjs/egg-scripts/) 和 [egg-cluster](https://github.com/eggjs/egg-cluster) 文档。

停止命令 `$ egg-scripts stop [--title=egg-server]`：

- 该命令将杀死 master 进程，并通知 worker 和 agent 优雅退出。
- 如果不指定 `title` 参数，则会终止所有的 Egg 应用。
- 也可以直接通过 `ps -eo "pid,command" | grep -- "--title=egg-server"` 来找到 master 进程，并 `kill` 掉，无需 `kill -9`。

## 性能监控

[官方介绍](https://eggjs.org/zh-cn/core/deployment.html#%E7%9B%91%E6%8E%A7)。

# 实战经验总结

1. 如果向 `ctx.session` 注入属性，要注意其大小，因为 `session` 与 `cookie` 对应，超过大小的赋值会被忽略，且不会报错。
2. 运行后的总配置可以查看 `/run/application_config.json`，配置有没有生效，或者配置默认值都可以在此处找到。
3. 运行错误，或者手动设定的日志记录，都可以在 `logs/` 目录下找到。
