import { Controller } from 'egg';
import { RESP_STATE } from '../../helper/constants';

class TestNodemailer extends Controller {

  // 发送
  public async send() {
    const { ctx } = this;
    const { toList, subject, text, html } = ctx.request.body;
    const res = await ctx.service.useNodemailer.send(toList, subject, text, html);
    ctx.resp({
      data: res,
      state: {
        succ: true,
        code: RESP_STATE.SUCC.CODE,
        msg: 'success',
      },
    });
  }

  // 接收
  public async receive() {
    const { ctx } = this;
    const res = await ctx.service.useNodemailer.receive() as any[];
    ctx.resp({
      data: res,
      state: {
        succ: true,
        code: RESP_STATE.SUCC.CODE,
        msg: 'success',
      },
    });
  }


}
export default TestNodemailer;
