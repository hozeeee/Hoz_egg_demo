
# 中间件(Middleware)

统一放在 `app/middleware` 目录中。以 `app/middleware/gzip.js` 为例：

``` js
// app/middleware/gzip.js
const isJSON = require('koa-is-json');
const zlib = require('zlib');
module.exports = options => {
  return async function gzip(ctx, next) {
    await next();
    // 后续中间件执行完成后将响应体转换成 gzip
    let body = ctx.body;
    if (!body) return;
    // 支持 options.threshold
    if (options.threshold && ctx.length < options.threshold) return;
    if (isJSON(body)) body = JSON.stringify(body);
    // 设置 gzip body，修正响应头
    const stream = zlib.createGzip();
    stream.end(body);
    ctx.body = stream;
    ctx.set('Content-Encoding', 'gzip');
  };
};
```

可以看到，中间件的配置文件，它需要 `exports` 一个普通的 `function`(参数是`options`和`app`) ，返回值是一个异步函数。

然后，在 `app/config/config.default.js` 中配置中间件，还能指定使用的条件：

``` js
module.exports = {
  // 配置需要的中间件，数组顺序即为中间件的加载顺序
  middleware: [ 'gzip' ],
  // 配置 gzip 中间件的配置
  gzip: {
    threshold: 1024, // 小于 1k 的响应体不压缩
  },
};
```

注意，**中间件是有序的**，等效于配置的顺序。

在 `config.default.js` 配置的中间件都会被合并到 `app.config.appMiddleware` ，如果想在框架和插件中使用中间件，需要配置到 `app.config.coreMiddleware` ：

``` js
// app.js
module.exports = app => {
  // 在中间件最前面统计请求时间
  app.config.coreMiddleware.unshift('report');
};

// app/middleware/report.js
module.exports = () => {
  return async function (ctx, next) {
    const startTime = Date.now();
    await next();
    // 上报请求时间
    reportTime(Date.now() - startTime);
  }
};
```

应用层定义的中间件(`app.config.appMiddleware`)和框架默认中间件(`app.config.coreMiddleware`)都会被加载器加载，并挂载到 `app.middleware` 上。

注意：**框架和插件**加载的中间件会在**应用层配置**的中间件之前，框架默认中间件**不能被应用层中间件覆盖**，如果应用层有自定义同名中间件，在启动时会报错。


TODO:[框架默认中间件](https://github.com/eggjs/egg/tree/master/app/middleware)


## router 中使用中间件

如果只想对某个路由(接口)使用特定中间件，那就应该在 `app/router.js` 指定中间件配置：

``` js
module.exports = app => {
  const gzip = app.middleware.gzip({ threshold: 1024 });
  app.router.get('/needgzip', gzip, app.controller.handler);
};
```

### 中间件通用配置项

- `enable`: 控制中间件**是否开启**。
- `match`:  设置只有**符合某些规则**的请求才会**经过**这个中间件。
- `ignore`: 设置**符合某些规则**的请求**不经过**这个中间件。

其中， `match` 和 `ignore` 支持多种类型的配置方式:

- 字符串: 匹配 url 的路径前缀，所有以配置的字符串作为前缀的 url 都会匹配上。
- 数组: 匹配数组拼接成的 url 的路径前缀，类似字符串。
- 正则: 匹配满足正则验证的 url 的路径。
- 函数: 参数是 `ctx` ，返回布尔类型来判断是否匹配。

示例：

``` js
const pathMatching = require('egg-path-matching');
const options = {
  ignore: '/api', // string will use parsed by path-to-regexp
  // support regexp
  ignore: /^\/api/,
  // support function
  ignore: ctx => ctx.path.startsWith('/api'),
  // support Array
  ignore: [ ctx => ctx.path.startsWith('/api'), /^\/foo$/, '/bar'],
  // support match or ignore
  match: '/api',
};

const match = pathMatching(options);
assert(match('/api') === true);
assert(match('/api/hello') === true);
assert(match('/api') === true);
```

