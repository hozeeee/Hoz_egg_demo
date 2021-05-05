import { Controller } from 'egg';

// "控制器"必须继承自 Controller
// 这里的"控制器"只是一个"容器"，里面的方法才是实际处理请求
// "控制器"的划分，既可以用页面划分，也可以用功能划分
class HomeController extends Controller {

  // 这里的方法才是实际处理请求和响应的地方
  // 一般会把处理逻辑放在 service 中， service 会自动被挂载到 ctx 对象上
  public async _index_demo() {
    /**
      this 中包含：（ Controller 与 Service 相同）
        ctx - 当前请求的 Context 实例。
            ctx 也有 logger ，用于记录请求相关信息（如 [$userId/$ip/$traceId/${cost}ms $method $url]）
        app - 应用的 Application 实例。
            app 也有 logger ，用于记录一些业务上与请求无关的信息，如启动阶段的一些数据
        config - 应用的配置。
        service - 应用所有的 service。
        logger - 为当前 controller 封装的 logger 对象。
            logger.debug()
            logger.info()
            logger.warn()
            logger.error()
     */
    const { ctx } = this;
    ctx.body = await ctx.service.test.sayHi('egg');
  }

  // 返回前端页面
  public async index() {
    const { ctx } = this;
    await ctx.render('index.html');
  }
}

export default HomeController;


/**
  const { logger } = ctx;

 */
