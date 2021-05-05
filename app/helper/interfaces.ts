
export interface IRespState {
  succ: boolean;
  code: string | number;
  msg: string;
}

export interface IRespPaging {
  current: number;
  size: number;
  total: number;
}

// 响应的数据格式
export interface IResp {
  data?: any;
  state: IRespState;
  paging?: IRespPaging;
}


// （找不到官方的 ts 定义，自己根据调试搞一个）
export interface IMiddlewareOpt {
  threshold: number;
}
