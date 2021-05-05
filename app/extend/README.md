
# 框架扩展

需要多框架扩展，都是在 `app/extend` 目录下创建特定的文件：

- 扩展 `app` 则创建 `app/extend/application.js`
- 扩展 `ctx` 则创建 `app/extend/context.js`
- 扩展 `ctx.request` 则创建 `app/extend/request.js`
- 扩展 `ctx.response` 则创建 `app/extend/response.js`
- 扩展 `ctx.helper` 则创建 `app/extend/helper.js`

扩展的属性和方法都会与源对象的 prototype 对象进行合并。

扩展的示例：

``` js
const BAR = Symbol('Application#bar');
module.exports = {
  // 扩展方法
  foo(param) {
    // ....
  },
  // 扩展访问属性 (推荐的方式是使用 Symbol + Getter 的模式)
  get bar() {
    if (!this[BAR]) {
      // 实际情况肯定更复杂
      this[BAR] = this.config.xx + this.config.yy;
    }
    return this[BAR];
  },
  // 扩展设置属性
  set baz(value) {
    // ....
  },
};
```

## 注意事项

`ctx`、`ctx.request` 、`ctx.response` 都是 **请求级别** ，也就是说，注入的属性和方法都是针对当前请求的，不同请求之间相互独立。

各个扩展文件中的 `this` 都表示当前对象，例如 `app/extend/context.js` 的 `this` 就是 `ctx`；`app/extend/request.js` 的 `this` 就是 `ctx.request`，其他同理。

`ctx.helper` 一般用来提供一些实用的 utility 函数。

还支持 **按照环境进行扩展** ，例如 `app/extend/application.unittest.js` 则只会在运行环境为 unittest 才会生效。

