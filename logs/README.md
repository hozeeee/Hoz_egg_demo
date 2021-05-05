
# 日志输出

路径：

- 所有日志文件默认都放在 `${appInfo.root}/logs/${appInfo.name}` 路径下。

分类：

- **appLogger**: `${appInfo.name}-web.log`，应用相关日志，供应用**开发者使用的日志**。我们在绝大数情况下都在使用它。
  - `ctx.logger.*`
  - `app.logger.*`
- coreLogger: `egg-web.log`，框架**内核**、**插件**日志。
  - `ctx.coreLogger.*`
  - `app.coreLogger.*`
  - `agent.coreLogger.*`
- errorLogger: `common-error.log`，实际一般不会直接使用它，任何 `logger` 的 `.error()` 调用输出的日志都会重定向到这里，重点通过**查看此日志定位异常**。
- agentLogger: `egg-agent.log agent`，进程日志，框架和使用到 `agent` **进程执行任务**的插件会打印一些日志到这里。
  - `agent.coreLogger.*`
  - `agent.logger.*`

## 日志相关配置

``` js
// config/config.${env}.js

exports.logger = {
  // 修改日志输出路径
  dir: '/path/to/your/custom/log/dir',
  // 修改各类型日志的输出名字
  appLogName: `${appInfo.name}-web.log`,
  coreLogName: 'egg-web.log',
  agentLogName: 'egg-agent.log',
  errorLogName: 'common-error.log',
  // 默认编码为 utf-8
  encoding: 'gbk',
  // 设置输出格式为 JSON，方便日志监控系统分析
  outputJSON: true,
  // 指定打印到日志文件的级别
  level: 'DEBUG',
  // 处于性能考虑，生产环境会禁止 DEBUG 级别的日志打印到文件，如确实有需要，下面参数设为 true
  allowDebugAtProd: true,
  // 指定输出到终端的日志级别，默认为 INFO 及以上。在 local 和 unittest 环境下默认为 WARN
  consoleLevel: 'DEBUG',
};
// 自定义日志格式
exports.customLogger = {
  xxLogger: {
    file: path.join(appInfo.root, 'logs/xx.log'),
    formatter(meta) {
      return `[${meta.date}] ${meta.message}`;
    },
    contextFormatter(meta) {
      return `[${meta.date}] [${meta.ctx.method} ${meta.ctx.url}] ${meta.message}`;
    },
  },
},
// 日志切割 (选择其中一种配置即可)
exports.logrotator = {
  // 按照大小进行切割 (添加到 filesRotateBySize 的日志文件不再按天进行切割)
  filesRotateBySize: [
    path.join(appInfo.root, 'logs', appInfo.name, 'egg-web.log'),
  ],
  maxFileSize: 2 * 1024 * 1024 * 1024,
  // 按照小时切割 (添加到 filesRotateByHour 的日志文件不再被按天进行切割)
  filesRotateByHour: [
    path.join(appInfo.root, 'logs', appInfo.name, 'common-error.log'),
  ],
},
```

## 日志级别

日志分为 `NONE`，`DEBUG`，`INFO`，`WARN` 和 `ERROR` 5 个级别。

当设为 `NONE` 时，表示不打印日志。

`DEBUG`、`INFO`、`WARN`、`ERROR` 优先级是由小到大，当设为“较低”的输出级别是，“较高”级别的日志也能打印，如设置为 `INFO` 时，`WARN`、`ERROR` 的日志都能输出，但 `DEBUG` 不会。

## 日志上报到第三方服务

[官方介绍](https://eggjs.org/zh-cn/core/logger.html#%E9%AB%98%E7%BA%A7%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%A5%E5%BF%97)。

## 性能

通常 Web 访问是高频访问，每次打印日志都写磁盘会造成频繁磁盘 IO，为了提高性能，我们采用的文件日志写入策略是：

日志同步写入内存，异步每隔一段时间(默认 1 秒)刷盘

更多详细请参考 [egg-logger](https://github.com/eggjs/egg-logger) 和 [egg-logrotator](https://github.com/eggjs/egg-logrotator)。
