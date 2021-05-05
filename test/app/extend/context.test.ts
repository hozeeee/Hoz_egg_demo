import * as assert from 'assert';
import { Context } from 'egg';
import { app, mock } from 'egg-mock/bootstrap';
import { IResp } from '../../../app/helper/interfaces';

describe('test extend.context', () => {
  it('get user', () => {
    // 模拟一次请求的 Session 数据
    app.mockSession({});

    const ctx: Context = app.mockContext();
    const obj = { foo: 'baz' }
    ctx.session.user = obj;
    assert(ctx.user === obj);
  });

  // 因为 mock 之后会一直生效，避免每个单元测试用例之间是不能相互 mock 污染的。
  // 调用 mock.restore 还原所有 mock 。
  afterEach(mock.restore);

  it('resp', () => {
    const ctx: Context = app.mockContext();
    const obj = {
      data: { foo: 'baz' },
      state: {
        code: 200,
      },
      paging: {
        size: 10,
        current: 1,
        total: 100
      }
    } as IResp;
    ctx.resp(obj);
    assert(ctx.body.data === obj.data);
    assert(ctx.body.paging === obj.paging);
    const stateKeys = Object.keys(ctx.body.state);
    assert(stateKeys.includes('succ'));
    assert(stateKeys.includes('code'));
    assert(stateKeys.includes('msg'));
  });
});
