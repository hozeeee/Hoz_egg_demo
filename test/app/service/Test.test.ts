import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/Test.test.js', () => {
  let ctx: Context;

  before(async () => {
    // 需要通过 app.mockContext() 先创建一个 ctx
    ctx = app.mockContext();
  });

  it('sayHi', async () => {
    // 然后通过 ctx.service.${serviceName} 拿到 Service 实例
    const result = await ctx.service.test.sayHi('egg');
    assert(result === 'hi, egg');
  });
});
