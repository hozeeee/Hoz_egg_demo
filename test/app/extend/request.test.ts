import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';
import { Context } from 'egg';

describe('test extend.request', () => {
  it('isMobile', async () => {
    const ctx: Context = app.mockContext({
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0' }
    });
    assert(ctx.request.isMobile === false);
    const ctx2: Context = app.mockContext({
      headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/67.0.3396.87 Mobile Safari/537.36' }
    });
    assert(ctx2.request.isMobile === true);
  });
});