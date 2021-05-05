import { Controller } from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import * as dayjs from 'dayjs';
import { write as asyncWriteStream } from 'await-stream-ready'; // 用于异步写入文件流
import streamWormhole from 'stream-wormhole'; // 用于异常时消耗掉文件流

// 自动生成路径上的所有文件夹
function mkDirsSync(dir) {
  if (fs.existsSync(dir)) return true;
  // 判断上级是否存在，存在就创建当前目录
  if (mkDirsSync(path.dirname(dir))) {
    fs.mkdirSync(dir);
    return true;
  }
}

class Demo extends Controller {

  // 当请求的 Content-Type 为以下之一
  //    application/json
  //    application/json-patch+json
  //    application/vnd.api+json
  //    application/csp-report
  // 会按照 json 格式对请求 body 进行解析，
  // 并限制 body 最大长度为 100kb。
  public async json() {
    const { ctx } = this;
    ctx.body = { data: ctx.request.body };
    ctx.status = 201;
  }

  // 当请求的 Content-Type 为 application/x-www-form-urlencoded
  // 会按照 form 格式对请求 body 进行解析，
  // 并限制 body 最大长度为 100kb。
  public async form() {
    const { ctx } = this;
    ctx.body = { data: ctx.request.body };
    ctx.status = 201;
  }

  // 当请求的 Content-Type 为 multipart/form-data
  // 可以通过 multipart 获取数据
  // 需要注意的是，前端并不需要手动设置 Content-Type，否则会导致服务端无法解析
  public async formData() {
    const { ctx } = this;
    const parts = ctx.multipart();
    const fields = {};
    let part;
    while ((part = await parts()) != null) {
      // 如果只是传字段数据，stream 的类型是数组，对应的是 [field, value, valueTruncated, fieldnameTruncated]
      if (Object.prototype.toString.call(part) !== '[object Array]') continue;
      fields[part[0]] = part[1];
    }
    ctx.body = fields;
    ctx.status = 201;
  }

  // 在 URL 中 ? 后面的部分是一个 Query String，通常用于 Get 方法(但不是规定)
  // 当 Query String 中的 key 重复时，ctx.query 只取 key 第一次出现时的值；
  // 但框架提供了 ctx.queries 对象，它不会丢弃任何一个重复的数据，而是将他们都放到一个数组中
  public async query() {
    const { ctx } = this;
    ctx.body = {
      data: {
        query: ctx.query,
        queries: ctx.queries,
      }
    };
    ctx.status = 201;
  }

  // 路由传参，需要在 router 中定义，如 /api/demo/params/:foo/:baz
  // 通过 ctx.params 可以获取参数
  public async params() {
    const { ctx } = this;
    ctx.body = { data: ctx.params };
    ctx.status = 201;
  }

  // 单文件上传
  // 需要注意，上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
  public async singleFile() {
    const { ctx } = this;
    // 获取单个文件流可以使用 ctx.getFileStream()
    const stream = await ctx.getFileStream();
    // 指定并创建目录
    const _todayDir = dayjs(Date.now()).format('YYYYMMDD');
    const _baseDir = path.join(process.cwd(), '/app/public/uploads', _todayDir);
    mkDirsSync(_baseDir);
    // 生成“写入文件流” （文件名应该加载时间戳和随机数，避免被覆盖）
    const name = path.join(_baseDir, stream.filename);
    const writeStream = fs.createWriteStream(name);
    // 异步写入文件
    try {
      await asyncWriteStream(stream.pipe(writeStream));
      // TIPS: 获取到流和文件名后，可以保存到服务器，也可以保存到 oss 上
    } catch (err) {
      await streamWormhole(stream);
      throw err;
    }
    ctx.status = 201;
    ctx.body = {
      data: '上传成功',
      link: `/public/uploads/${_todayDir}/${stream.filename}`,
    };
  }

  // 多文件上传 & 携带普通字段
  // 与获取 form-data 字段类似，同样是使用 ctx.multipart()
  public async multiFiles() {
    const { ctx } = this;
    const parts = ctx.multipart();
    const fields = {};
    const files: any[] = [];
    let part;
    while ((part = await parts())) {
      // 普通字段的读取
      if (Object.prototype.toString.call(part) === '[object Array]') {
        fields[part[0]] = part[1];
      }
      // 对于文件流，part 的类型就不是数组
      else {
        if (!part.filename) {
          // TODO: 前端可能没选文件就发送 (未找到解决办法)
          continue;
        }
        // 指定并创建目录
        const _todayDir = dayjs(Date.now()).format('YYYYMMDD');
        const _baseDir = path.join(process.cwd(), '/app/public/uploads', _todayDir);
        mkDirsSync(_baseDir);
        // 生成“写入文件流” （文件名应该加载时间戳和随机数，避免被覆盖）
        const name = path.join(_baseDir, part.filename);
        const writeStream = fs.createWriteStream(name);
        // 异步写入文件
        try {
          await asyncWriteStream(part.pipe(writeStream));
          files.push({
            field: part.fieldname,
            filename: part.filename,
            encoding: part.encoding,
            mime: part.mime,
            link: `/public/uploads/${_todayDir}/${part.filename}`,
          });
          // TIPS: 获取到流和文件名后，可以保存到服务器，也可以保存到 oss 上
        } catch (err) {
          await streamWormhole(part);
          throw err;
        }
      }
    }
    ctx.body = { data: { fields, files } };
    ctx.status = 201;
  }




  // TODO: 文件断点续传

  // TODO: 参考 https://github.com/eggjs/examples/tree/master/multipart

  // TODO: 无头浏览器


}
export default Demo;
