import { Controller } from 'egg';
import * as fs from 'fs';
import * as path from 'path';

class HttpClientDemo extends Controller {

  public async post() {
    const { ctx } = this;
    const result = await ctx.curl('https://httpbin.org/post', {
      method: 'POST', // 默认是 "GET"
      contentType: 'json',  // 发送的数据类型，默认是 application/x-www-form-urlencoded
      headers: {
        'x-foo': 'bar',
        // ....
      },
      data: {
        hello: 'world',
        now: Date.now(),
      },
      dataType: 'json', // 响应的数据以 json 解析，默认是 Buffer。可设置的值有 text 和 json。
      timeout: [5000, 5000], // Number|Array 请求超时时间，默认是 [ 5000, 5000 ]，即创建连接超时是 5 秒，接收响应超时是 5 秒。
      /**
       * 其他不太常用的参数说明：
       * dataAsQueryString: false, // Boolean。设为 true 时，即使 POST 也会强制将 options.data 以 querystring.stringify 处理之后拼接到 url 的 query 参数上。
       * content: '<xml><hello>world</hello></xml>', // String|Buffer。发送请求正文，如果设置了此参数，那么会直接忽略 data 参数。
       * stream: fs.createReadStream('/path/to/read'), // ReadStream。设置发送请求正文的可读数据流，默认是 null。一旦设置了此参数，HttpClient 将会忽略 data 和 content。
       * writeStream: fs.createWriteStream('/path/to/store'), // 设置接受响应数据的可写数据流，默认是 null。一旦设置此参数，那么返回值 result.data 将会被设置为 null， 因为数据已经全部写入到 writeStream 中了。
       * consumeWriteStream: false, // Boolean。是否等待 writeStream 完全写完才算响应全部接收完毕，默认是 true。不建议修改默认值，除非我们明确知道它的副作用是可接受的，否则很可能会导致 writeStream 数据不完整。
       * fixJSONCtlChars: false, // Boolean。是否自动过滤响应数据中的特殊控制字符 (U+0000 ~ U+001F)，默认是 false。通常一些 CGI 系统返回的 JSON 数据会包含这些特殊控制字符，通过此参数可以自动过滤掉它们。
       * agent: HttpAgent 允许通过此参数覆盖默认的 HttpAgent，如果你不想开启 KeepAlive，可以设置此参数为 false。
       * httpsAgent: HttpsAgent 允许通过此参数覆盖默认的 HttpsAgent，如果你不想开启 KeepAlive，可以设置此参数为 false。
       * auth: 'foo:bar', // String。简单登录授权（Basic Authentication）参数，必须以 `user:password` 格式设置，将以明文方式将登录信息以 Authorization 请求头发送出去。
       * digestAuth: 'foo:bar', // String。摘要登录授权（Digest Authentication）参数，必须以 `user:password` 格式设置，设置此参数会自动对 401 响应尝试生成 Authorization 请求头， 尝试以授权方式请求一次。
       * followRedirect: false, // Boolean。是否自动跟进 3xx 的跳转响应，默认是 false。
       * maxRedirects: 10, // Number。设置最大自动跳转次数，避免循环跳转无法终止，默认是 10 次。此参数不宜设置过大，它只在 followRedirect=true 情况下才会生效。
       * formatRedirectUrl: (from, to) => url.resolve(from, to), // 自定义实现 302、301 等跳转 url 拼接，默认是 url.resolve(from, to)。
       *                                                            可以修改 to 实现之定义跳转。
       * beforeRequest: options => { options.headers['x-request-id'] = uuid.v1(); }, // HttpClient 在请求正式发送之前，会尝试调用 beforeRequest 钩子，允许我们在这里对请求参数做最后一次修改。
       * streaming: false, // Boolean。是否直接返回响应流，默认为 false。开启后，HttpClient 会在拿到响应对象 res 之后马上返回，此时 result.headers 和 result.status 已经可以读取到，只是没有读取 data 数据而已。
       *                      注意：如果 res 不是直接传递给 body，那么我们必须消费这个 stream，并且要做好 error 事件处理。
       * gzip: false, // Boolean。是否支持 gzip 响应格式，默认为 false。
       * timing: false, // Boolean。是否开启请求各阶段的时间测量，默认为 false。开启后，可以通过 result.res.timing 拿到这次 HTTP 请求各阶段的时间测量值（单位是毫秒）。
       */
    });
    // result 会包含 3 个属性：status, headers 和 data （如果是文件，还有 files ）
    const { status, headers, data } = result;
    ctx.body = { status, headers, data }
  }

  // 文件上传
  public async upload() {
    const { ctx } = this;
    const filePath = path.join(process.cwd(), '/app/public/empty.txt');
    // 上传到本机服务
    const result = await ctx.curl(`${ctx.protocol}://${ctx.host}/api/demo/multiFiles`, {
      // 不需要指定 contentType，请求数据格式必须以 multipart/form-data 进行提交
      method: 'POST',
      dataType: 'json',
      data: {
        foo: 'bar',
      },
      headers: {
        'Cookie': ctx.headers['cookie'],
        'x-csrf-token': ctx.headers['x-csrf-token']
      },
      // 单文件上传
      files: filePath,  // String | ReadStream | Buffer | Array | Object
      // 多文件上传
      // files: {
      //   file1: __filename,
      //   file2: fs.createReadStream(__filename),
      //   file3: Buffer.from('mock file content'),
      // },
    });
    ctx.body = result.data;
  }


  // 以流的形式上传文件
  async uploadByStream() {
    const { ctx } = this;
    const filePath = path.join(process.cwd(), '/app/public/empty.txt');
    const fileStream = fs.createReadStream(filePath);
    // 使用本地 stream 接口代替
    const result = await ctx.curl(`${ctx.protocol}://${ctx.host}/httpClient/upload/stream`, {
      method: 'POST',
      headers: {
        'Cookie': ctx.headers['cookie'],
        'x-csrf-token': ctx.headers['x-csrf-token']
      },
      // 以 stream 模式提交
      stream: fileStream,
    });
    ctx.body = result.data;
  }
  async postStream() {
    const ctx = this.ctx;
    let size = 0;
    ctx.req.on('data', data => {
      size += data.length;  // 实际将数据流累加拼接，然后格式化
    });
    ctx.req.resume();
    await new Promise((resolve, reject) => {
      ctx.req.on('end', resolve);
      ctx.req.on('error', reject);
    });
    ctx.body = {
      streamSize: size,
    };
  }


}
export default HttpClientDemo;
