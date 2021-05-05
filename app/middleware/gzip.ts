// import { EggLoaderOptions } from 'egg';
import * as isJSON from 'koa-is-json';
import zlib = require('zlib');
import { IMiddlewareOpt } from '../helper/interfaces';

// 中间件的使用 和 options 的参数都在 config.default.js 中配置
export default (options: IMiddlewareOpt) => {
  // 与 Koa 的洋葱模型一致，必须是一个异步函数
  return async function gzip(ctx, next) {
    await next();

    // 后续中间件执行完成后将响应体转换成 gzip
    let body = ctx.body;

    if (!body) return;
    if (options.threshold && ctx.length < options.threshold) return;
    if (isJSON(body)) body = JSON.stringify(body);

    // 设置 gzip body，修正响应头
    const stream = zlib.createGzip();
    stream.end(body);
    ctx.body = stream;
    ctx.set('Content-Encoding', 'gzip');
  };
};




