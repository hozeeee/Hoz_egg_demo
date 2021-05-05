import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap'; // 框架提前创建 app 实例

describe('test/app/controller/home.test.ts', () => {

  // doSomethingBefore();
  // 如果有 doSomethingBefore 未被注释。
  // Mocha 刚开始运行的时候会载入所有用例，这时 describe 方法就会被调用，那 doSomethingBefore 会被执行。
  // 如果希望使用 only 的方式只执行某个用例，doSomethingBefore 还是会被执行，这是非预期的。
  // 正确做法是放在 before 中：
  before(() => { console.log('test/app/controller/home.test.ts---before'); });
  // 类似的钩子函数还有 before、beforeEach、afterEach、after。
  // 每个用例会按 before -> beforeEach -> it -> afterEach -> after 的顺序执行，而且可以定义多个。

  it('should GET /', async () => {
    // egg-mock 对 app 增加了 app.mockCsrf() 方法来模拟取 CSRF token 的过程。
    app.mockCsrf();

    // app.httpRequest() 利用 SuperTest 发起一个真实请求， 来将 Router 和 Controller 连接起来
    // [SuperTest](https://github.com/visionmedia/supertest)
    // 如果是发送携带 body 的请求，请查看 SuperTest 的官方文档
    const result = await app.httpRequest().get('/').expect(200);

    // 通过 app.mockContext() 获取 ctx
    const ctx = app.mockContext();

    // 断言
    assert(ctx.method === 'GET');
    assert(typeof result.text === 'string');
  });

});
