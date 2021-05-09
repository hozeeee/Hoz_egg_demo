import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {
    httpclient: {
      // 打开抓包工具后再解开下面代码
      request: {
        // enableProxy: true,
        // rejectUnauthorized: false,
        // proxy: 'http://127.0.0.1:8888',
      },
    }
  };
  return config;
};
