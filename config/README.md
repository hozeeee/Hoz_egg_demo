
# 插件

一个插件包含了 **Service、中间件、配置、框架扩展** 等等，但没有独立的 `Router` 和 `Controller`，也没有 `plugin.js`，不能决定其他插件的开启与否，多个插件可以包装为一个上层框架。

## 使用

以 `egg-mysql` 为例：

- 安装：（官方建议使用 `^` 方式引入，且强烈不建议锁定版本）

  ``` shell
  $ npm i egg-mysql --save
  ```

- 在 `config/plugin.js` 中配置：

  ``` js
  exports.mysql = {
    enable: true, // 是否开启此插件，默认为 true
    package: 'egg-mysql', // 模块名称
    // path: '', // 插件绝对路径，跟 package 配置互斥
    // env: '', // 只有在指定运行环境才能开启
    // 插件会有自己的配置，具体使用看各个插件的文档
    client: {
      host: 'mysql.com',
      port: '3306',
      user: 'test_user',
      password: 'test_password',
      database: 'test',
    },
  };
  ```

## 根据环境配置

还支持 `plugin.{env}.js` 这种模式，会根据运行环境加载插件配置。

例如 `plugin.local.js`，但需要注意，**不存在 `plugin.default.js`** 。

## 框架默认内置了企业级应用常用的插件

- [`onerror`](https://github.com/eggjs/egg-onerror) 统一异常处理
- [`Session`](https://github.com/eggjs/egg-session) Session 实现
- [`i18n`](https://github.com/eggjs/egg-i18n) 多语言
- [`watcher`](https://github.com/eggjs/egg-watcher) 文件和文件夹监控
- [`multipart`](https://github.com/eggjs/egg-multipart) 文件流式上传
- [`security`](https://github.com/eggjs/egg-security) 安全
- [`development`](https://github.com/eggjs/egg-development) 开发环境配置
- [`logrotator`](https://github.com/eggjs/egg-logrotator) 日志切分
- [`schedule`](https://github.com/eggjs/egg-schedule) 定时任务
- [`static`](https://github.com/eggjs/egg-static) 静态服务器
- [`jsonp`](https://github.com/eggjs/egg-jsonp) jsonp 支持
- [`view`](https://github.com/eggjs/egg-view) 模板引擎

更多社区的插件可以 GitHub 搜索 [`egg-plugin`](https://github.com/topics/egg-plugin)。



