/**
 * 此文件存放定值（非官方规定）
 */



// 响应状态码需要与后端保持一致
export const RESP_STATE: { [prop: string]: { CODE: number; MSG: string; }; } = {
  SUCC: { CODE: 200, MSG: '成功' },
  NOT_LOGIN: { CODE: 300, MSG: '未登录' },
  TOKEN_INVALID: { CODE: 301, MSG: '无效 token' },
  PARAM_ERR: { CODE: 401, MSG: '参数错误' },
  SERVER_ERR: { CODE: 500, MSG: '服务器错误' },
  TIME_OUT: { CODE: 408, MSG: '请求超时' },
};

