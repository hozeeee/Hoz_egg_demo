import { Context } from 'egg';
import { RESP_STATE } from '../helper/constants';
// import { IMiddlewareOpt } from '../helper/interfaces';

export default () => {
  return async (ctx: Context, next) => {
    try {
      await next();
    } catch (error) {
      const { request, app } = ctx;
      console.log('\r\nerror:', error, '\r\n', request.path, '------------------------\r\n');

      /**
       * 注意，自定义的错误统一处理函数捕捉错误后也要 `app.emit()` 抛出原错误
       * 框架会统一监听，并打印相应的错误日志
       */
      app.emit('error', error, ctx);

      // 处理后返回错误信息给前端
      ctx.resp({
        state: {
          succ: false,
          code: RESP_STATE.SERVER_ERR.CODE,
          msg: error.message,
        },
      });

      // TODO: 可以将错误上报

    }
  }
}