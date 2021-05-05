import { Service } from 'egg';

// 简单做个登录列表，没有期限，重启服务失效
export default class SimpleLoginList extends Service {

  private _list = {};

  public async get(symbol: string) {
    return this._list[symbol];
  }


  public async add(symbol: string) {
    // 随便生成随机数作为 token
    this._list[symbol] = Math.round(Math.random() * 1000000000);
  }

}
