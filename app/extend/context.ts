/**
 * 针对 this.ctx 的扩展。是 请求级别 的。
 * 框架会将此文件中定义的对象与 Koa Context 的 prototype 的对象进行合并。
 */
import { Context } from 'egg';
import { IResp } from '../helper/interfaces';
import { RESP_STATE } from '../helper/constants';
// 官方建议使用 Symbol + Getter 的模式。对于同一个属性的访问就只会计算一次，实现缓存。
const USER = Symbol('Context#user');

export default {
  // 注意！这里的 this 就是 ctx

  // 通过 this.user 可以读取该属性的值
  get user() {
    if (!this[USER]) this[USER] = this.session && this.session.user;
    return this[USER];
  },

  // 自定义响应方法 (用于限制符合格式的数据)
  resp(_data: IResp) {
    const ctx: Context = this;
    let stateCode = Number(_data.state.code);
    if (Number.isNaN(stateCode)) stateCode = 0;
    ctx.body = {
      state: {
        succ: stateCode === RESP_STATE.SUCC.CODE,
        code: stateCode,
        msg: _data.state.msg || RESP_STATE.SUCC.MSG,
      },
      data: _data.data,
      paging: _data.paging,
    };
  },

};
