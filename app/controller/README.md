
# 控制器(Controller)

统一放在 `app/controller` 目录下，支持多级目录，访问的时候可以通过目录名级联访问。

负责**解析**用户的**输入**，处理后**返回**相应的**结果**。

示例：

``` js
// app/controller/post.js
const Controller = require('egg').Controller;
class PostController extends Controller {
  async create() {
    const {
      ctx,      // 请求上下文
      app,      // 应用实例
      service,  // 业务层，等价于 this.ctx.service
      logger    // 日志对象，含有 debug/info/warn/error 4个方法
     } = this;
    const createRule = {
      title: { type: 'string' },
      content: { type: 'string' },
    };
    // 校验参数 (会抛出异常)
    ctx.validate(createRule);
    // 组装参数
    const author = ctx.session.userId;
    const req = Object.assign(ctx.request.body, { author });
    // 调用 Service 进行业务处理
    const res = await service.post.create(req);
    // 设置响应内容和响应状态码
    ctx.body = { id: res.id };
    ctx.status = 201;
  }
}
module.exports = PostController;
```

## 参数获取

无论是哪种参数，都是通过 `this.ctx.*` 获取。

1. `query`: 在 URL 中 `?` 后面的部分是一个 **Query String** ，`query` 对象已经对其封装成对象。

2. `queries`: 假如参数中没有相同字段，效果与 `query` 相同。字段的值会被存放到数组中：
    - 例如 `GET /posts?category=egg&id=1&id=2&id=3`
    - 得到 `{category: ['egg'], id: ['1', '2', '3']}`

3. `params`: 以请求路径作为参数的，就是 **Router params** 。
    - 假设定义了： `app.get('/projects/:projectId/app/:appId', 'app.listApp');`
    - 请求地址 `GET /projects/1/app/2`
    - 得到 `{projectId: '1', appId: '2'}`

4. `body`: 通过请求体传参。
    - 当 Content-Type 为 `application/json` 时，按照 json 格式解析 body 。
      - 同类型的还有 `application/json-patch+json`, `application/vnd.api+json`, `application/csp-report` 。
    - 当 Content-Type 为 `application/x-www-form-urlencoded` 时，按照 form 格式解析 body 。
    - 上面两种情况，默认限制最大长度为 `100kb` 。可以通过 `config/config.default.js` 修改：

      ``` js
      module.exports = {
        bodyParser: {
          jsonLimit: '1mb',
          formLimit: '1mb',
        },
      };
      ```

    - 响应超长会返回 `413` ，解析错误会返回 `400` 。
    - `ctx.body` 是 `ctx.response.body` 的简写。

5. 文件: 浏览器通过 `Multipart/form-data` 格式发送文件。有两种模式：
    - Stream 模式 (默认):
      - 单文件使用 `ctx.getFileStream()` 获取上传的文件流。
      - 多文件使用 `ctx.multipart()` 获取上传的文件流，数据类型就是单文件流的数组。
      - 文件没有正确处理，应该把流消费掉，例子如下：

        ``` js
        const sendToWormhole = require('stream-wormhole');
        class UploaderController extends Controller {
          async upload() {
            // .....
            try {
              // ......
            } catch (err) {
              // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
              await sendToWormhole(stream);
              throw err;
            }
            // .....
          }
        }
        ```

    - File 模式:
      - 需要在 `config.default.js` 中配置 `exports.multipart = {mode: 'file'};`
      - 通过 `ctx.request.files` 可以获取上传的所有文件。
      - 官方建议处理文件后，将临时文件删除: `fs.unlink(file.filepath);`

6. `header`: 获取头部信息。但官方建议使用 `ctx.get(name)` 获取，因为它可以处理大小写。

7. `cookies`: 获取/设置 Cookie 信息。分别是 `get` 和 `set` 方法：
    - `let count = ctx.cookies.get('count') || 0;`
    - `ctx.cookies.set('count', ++count);`

8. `session`: 用来存储用户身份相关的信息，这份信息会加密后存储在 Cookie 中。
    - 读取: `const userId = ctx.session.userId;`
    - 删除: `ctx.session = null;`
    - 在 `config.default.js` 相关配置：

      ``` js
      module.exports = {
        key: 'EGG_SESS', // 承载 Session 的 Cookie 键值对名字
        maxAge: 86400000, // Session 的最大有效时间
      };
      ```
