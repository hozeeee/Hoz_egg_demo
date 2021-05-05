import { Controller } from 'egg';

class Login extends Controller {

  // 登录
  public async index() {
    const { ctx } = this;
    // const { user, pw } = ctx.request.body;
    // if()
    // 获取 session 判断是否已经登录
    ctx.body = { data: ctx.request.body };
    ctx.status = 201;
  }

  // 登出
  public async logout() {

  }


}
export default Login;
