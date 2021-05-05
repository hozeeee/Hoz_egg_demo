
# 单元测试

egg 使用 [`Mocha`](https://mochajs.org/) 测试框架，使用 [`power-assert`](https://github.com/power-assert-js/power-assert) 断言库。

框架约定 `test` 目录为存放所有测试脚本的目录，测试脚本文件统一按 `${filename}.test.js` 命名，必须以 `.test.js` 作为文件后缀，如下：

``` txt
test
├── controller
│   └── home.test.js
├── hello.test.js
└── service
    └── user.test.js
```

运行命令 `egg-bin test` 会自动执行 `test` 目录下的以 `.test.js` 结尾的文件（默认 [`glob`](https://www.npmjs.com/package/glob) 匹配规则 `test/**/*.test.js` ）。

应用是以 `env: unittest` 启动。

通过 `$ TESTS=test/x.test.js npm test` 方式指定特定用例文件。

默认执行**超时时间**为 30 秒，也可以手动指定（单位毫秒），如设置为 5 秒：`$ TEST_TIMEOUT=5000 npm test`。

[**`egg-mock`**](https://github.com/eggjs/egg-mock) 是框架单独抽取的一个测试 mock 辅助模块， 有了它我们就可以非常快速地编写一个 app 的单元测试，并且还能快速创建一个 ctx 来测试它的属性、方法和 Service 等。

[`egg-mock`] 是扩展自 [**`mm`**](https://github.com/node-modules/mm) 模块， 它包含了 mm 的所有功能。

**关于单元测试的示例代码，都在此文件内。下面列举代码中未被提及的。**

## 异步调用的写法

`egg-bin` 支持测试异步调用，它支持多种写法：

``` js
// 使用返回 Promise 的方式
it('should redirect', () => {
  return app.httpRequest()
    .get('/')
    .expect(302);
});
// 使用 callback 的方式
it('should redirect', done => {
  app.httpRequest()
    .get('/')
    .expect(302, done);
});
// 使用 async
it('should redirect', async () => {
  await app.httpRequest()
    .get('/')
    .expect(302);
});
```

## Mock Service

例如，模拟 **`app/service/user`** 中的 `get(name)` 方法，让它返回一个本来不存在的用户数据。

``` js
it('should mock fengmk1 exists', () => {
  app.mockService('user', 'get', () => {
    return {
      name: 'fengmk1',
    };
  });

  return app.httpRequest()
    .get('/user?name=fengmk1')
    .expect(200)
    // 返回了原本不存在的用户信息
    .expect({
      name: 'fengmk1',
    });
});
```

通过 **`app.mockServiceError(service, methodName, error)`** 可以模拟 Service 调用异常。

例如，模拟 `app/service/user` 中的 `get(name)` 方法调用异常：

``` js
it('should mock service error', () => {
  app.mockServiceError('user', 'get', 'mock user service error');
  return app.httpRequest()
    .get('/user?name=fengmk2')
    // service 异常，触发 500 响应
    .expect(500)
    .expect(/mock user service error/);
});
```

## `egg-bin test` 通过 argv 方式传参

`egg-bin test` 除了环境变量方式，也支持直接传参，支持 mocha 的所有参数，参见：[`mocha usage`](https://mochajs.org/#usage) 。

``` shell
$ # npm 传递参数需额外加一个 `--`，参见 https://docs.npmjs.com/cli/run-script
$ npm test -- --help
$
$ # 等同于 `TESTS=test/**/test.js npm test`，受限于 bash，最好加上双引号
$ npm test "test/**/test.js"
$
$ # 等同于 `TEST_REPORTER=dot npm test`
$ npm test -- --reporter=dot
$
$ # 支持 mocha 的参数，如 grep / require 等
$ npm test -- -t 30000 --grep="should GET"
```

</br>

# 代码覆盖率

`egg-bin` 已经内置了 [`nyc`](https://github.com/istanbuljs/nyc) 来支持单元测试自动生成代码覆盖率报告。

通过 `egg-bin cov` 命令运行单元测试覆盖率，结果会输出到 `coverage/` 目录下，打开 `coverage/lcov-report/index.html` 可以查看覆盖率报告。

对于某些**不需要跑测试覆盖率的文件**，可以通过 **`COV_EXCLUDES`** 环境变量指定：

``` shell
$ COV_EXCLUDES=app/plugins/c* npm run cov
$ # 或者传参方式
$ npm run cov -- --x=app/plugins/c*
```

