import { Request } from 'egg';
const IS_MOBILE = Symbol('Context#isMobile');


export default {
  // 这里的 this 是 request

  get isMobile() {
    const request: Request = this;
    if (typeof this[IS_MOBILE] === 'undefined') {
      const userAgent = request.headers['user-agent'];
      this[IS_MOBILE] = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(userAgent);
    }
    return this[IS_MOBILE];
  }
}