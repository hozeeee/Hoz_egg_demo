import { Controller } from 'egg';
import { RESP_STATE } from '../../helper/constants';

class TestPuppeter extends Controller {

  // 访问 哔哩哔哩 首页，查询特定内容
  public async bilibiliHome() {
    const { ctx } = this;
    const { searchStr } = ctx.query;
    const res = await ctx.service.usePuppeteer.bilibiliHome(searchStr);

    ctx.resp({
      state: {
        succ: true,
        code: RESP_STATE.SUCC.CODE,
        msg: 'success',
      },
      data: res,
    });
  }


}
export default TestPuppeter;
