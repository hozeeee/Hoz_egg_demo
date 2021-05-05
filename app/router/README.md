
# 路由(Router)

在 `app/router.js`(或 `app/router/index.js`) 中配置。常用的请求方法都支持：

| 方法名  | API                          | 备注 |
|---------|------------------------------|------|
| HEAD    | `router.head`                |      |
| OPTIONS | `router.options`             |      |
| GET     | `router.get`                 |      |
| PUT     | `router.put`                 |      |
| POST    | `router.post`                |      |
| PATCH   | `router.patch`               |      |
| DELETE  | `router.delete`/`router.del` |      |
| 重定向  | `router.redirect`            |      |

所有方法的 API 都按如下格式使用（除了`router.redirect`）：

``` js
// 'path-match' 是可选的； middleware 也是可选的
router.<method>('path-match', app.controller.action);
router.<method>('router-name', 'path-match', app.controller.action);
router.<method>('path-match', middleware1, ..., middlewareN, app.controller.action);
router.<method>('router-name', 'path-match', middleware1, ..., middlewareN, app.controller.action);
// 对于 redirect ，示例如下
router.redirect('/', '/home/index', 302);
```

对于重定向，除了 `router.redirect` ，还可以使用 `ctx.redirect` 方法：

``` js
ctx.redirect(`http://example.com`);
```

方法 API 的参数说明：

- `router-name` 给路由设定一个别名，可以通过 Helper 提供的辅助函数 `pathFor` 和 `urlFor` 来生成 URL。(可选)
- `path-match` - 路由 URL 路径。
- `middleware` - 在 Router 里面可以配置多个 Middleware。(可选)
- `controller` - 指定路由映射到的具体的 controller 上，controller 可以有两种写法：
  - `app.controller.user.fetch` - 直接指定一个具体的 controller
  - `'user.fetch'` - 可以简写为字符串形式

关于获取**请求参数**：

- Query String: 如 `/search?name=egg` ，通过 `ctx.query.name` 获取。
- **路径**参数: 如 `app.router.get('/user/:id/:name', controller)` ，通过 `ctx.params.id` 获取。还能使用正则匹配，具体看官网。
- **请求体**参数: 请求体的数据可以有多种类型，需要依赖中间件解析，如 `bodyParser` ，然后通过 `ctx.request.body` 获取被解析后的数据对象。
