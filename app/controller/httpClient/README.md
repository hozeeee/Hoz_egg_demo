
# HttpClient

架基于 [urllib](https://github.com/node-modules/urllib) 内置实现了一个 [HttpClient](https://github.com/eggjs/egg/blob/master/lib/core/httpclient.js)，应用可以非常便捷地完成任何 HTTP 请求。

urllib 内置了 [formstream](https://github.com/node-modules/formstream) 模块来帮助我们生成可以被消费的 `form` 对象。

通过 `app.httpclient` 可以访问到 HttpClient，同时增加了 `app.curl(url, options)` 方法，等价于 `app.httpclient.request(url, options)`。

在 Context 同样有 `.httpclient` 和 `.curl`。

## 默认全局配置

``` js
// config/config.default.js
exports.httpclient = {
  // 是否开启本地 DNS 缓存，默认关闭，开启后有两个特性
  // 1. 所有的 DNS 查询都会默认优先使用缓存的，即使 DNS 查询错误也不影响应用
  // 2. 对同一个域名，在 dnsCacheLookupInterval 的间隔内（默认 10s）只会查询一次
  enableDNSCache: false,
  // 对同一个域名进行 DNS 查询的最小间隔时间
  dnsCacheLookupInterval: 10000,
  // DNS 同时缓存的最大域名数量，默认 1000
  dnsCacheMaxLength: 1000,

  request: {
    // 默认 request 超时时间
    timeout: 3000,
  },

  httpAgent: {
    // 默认开启 http KeepAlive 功能
    keepAlive: true,
    // 空闲的 KeepAlive socket 最长可以存活 4 秒
    freeSocketTimeout: 4000,
    // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
    timeout: 30000,
    // 允许创建的最大 socket 数
    maxSockets: Number.MAX_SAFE_INTEGER,
    // 最大空闲 socket 数
    maxFreeSockets: 256,
  },

  httpsAgent: {
    // 默认开启 https KeepAlive 功能
    keepAlive: true,
    // 空闲的 KeepAlive socket 最长可以存活 4 秒
    freeSocketTimeout: 4000,
    // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
    timeout: 30000,
    // 允许创建的最大 socket 数
    maxSockets: Number.MAX_SAFE_INTEGER,
    // 最大空闲 socket 数
    maxFreeSockets: 256,
  },
};
```

## 调试辅助

1. `config.local.js` 增加如下配置：

    ``` js
    exports.httpclient = {
      request: {
        enableProxy: true,
        rejectUnauthorized: false,
        // (调试工具的默认代理端口是 8888，具体看你的抓包工具的配置)
        proxy: 'http://127.0.0.1:8888',
      },
    }
    ```

2. 启动你的抓包工具，如 charles 或 fiddler。

## 常见错误

请查看[官方介绍](https://eggjs.org/zh-cn/core/httpclient.html#%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF)。
