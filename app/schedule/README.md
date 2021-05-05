
# 定时任务

在特定场景下，我们可能需要设置定时任务，例如：上报应用状态、从远程接口更新本地缓存、进行文件切割、临时文件删除等。

所有的定时任务都统一存放在 `app/schedule` 目录下，每一个文件都是一个独立的定时任务，可以配置定时任务的属性和要执行的方法。

## 示例代码

``` js
const Subscription = require('egg').Subscription;
class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1m', // 1 分钟间隔
      type: 'all', // 可选值 worker 和 all。前者是随机一个 worker 执行任务；后者是所有的 worker 都需要执行。
    };
  }
  // subscribe 是真正定时任务执行时被运行的函数  (同时支持 generator function 和 async function)
  async subscribe() {
    const res = await this.ctx.curl('http://www.api.com/cache', { dataType: 'json', });
    this.ctx.app.cache = res.data;
  }
}
module.exports = UpdateCache;
```

等效于：

``` js
module.exports = {
  schedule: {
    interval: '1m',
    type: 'all',
  },
  async task(ctx) {
    const res = await ctx.curl('http://www.api.com/cache', { dataType: 'json', });
    ctx.app.cache = res.data;
  },
};
```

等效于：（推荐使用）

``` js
// 此写法的好处的可以获取 app 的配置参数
module.exports = app => {
  return {
    schedule: {
      interval: app.config.cacheTick, // 看这里！
      type: 'all',
    },
    async task(ctx) {
      const res = await ctx.curl('http://www.api.com/cache', { contentType: 'json', });
      ctx.app.cache = res.data;
    },
  };
};
```

## 定时方式

定时方式有两种： `interval` 或 `cron` 。

`interval`：

- 通过 `schedule.interval` 参数来配置。
- 值类型可以是数值，单位是毫秒，例如 `5000`，就是 5000 毫秒；可以是带单位的字符串，例如 `5s`，会自动转化成毫秒单位。

`cron`：

- 通过 `schedule.cron` 参数来配置。
- 表达式通过 [`cron-parser`](https://github.com/harrisiirak/cron-parser#options) 进行解析。
- 示例 `'0 0 */3 * * *'` 表示每三小时准点执行一次。

## 其他参数

除了刚才介绍到的几个参数之外，定时任务还支持这些参数：

- `cronOptions`: 配置 cron 的时区等，参见 [`cron-parser`](https://github.com/harrisiirak/cron-parser#options) 文档。
- `immediate`: 配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务。
- `disable`: 配置该参数为 true 时，这个定时任务不会被启动。
- `env`: 数组，仅在指定的环境下才启动该定时任务。

## 执行日志

执行日志会输出到 `${appInfo.root}/logs/{app_name}/egg-schedule.log`。

默认不会输出到控制台，但可以通过 `config.customLogger.scheduleLogger` 来自定义：

``` js
// config/config.default.js
config.customLogger = {
  scheduleLogger: {
    // consoleLevel: 'NONE',
    // file: path.join(appInfo.root, 'logs', appInfo.name, 'egg-schedule.log'),
  },
};
```

## 手动执行定时任务

通过 `app.runSchedule(schedulePath)` 来运行一个定时任务。

`app.runSchedule` 接受一个定时任务文件路径（`app/schedule` 目录下的相对路径或者完整的绝对路径），执行对应的定时任务，返回一个 `Promise`。

- 在**单元测试**中手动调用：

  ``` js
  const mm = require('egg-mock');
  const assert = require('assert');
  it('should schedule work fine', async () => {
    const app = mm.app();
    await app.ready();
    await app.runSchedule('update_cache');  // 看这里！
    assert(app.cache);
  });
  ```

- 在 **`app.js`** 启动应用时调用：

  ``` js
  module.exports = app => {
    app.beforeStart(async () => {
      // 保证应用启动监听端口前数据已经准备好了
      // 后续数据的更新由定时任务自动触发
      await app.runSchedule('update_cache');  // 看这里！
    });
  };
  ```

## 扩展定时任务类型

此场景应用于**非单机部署**，即，一个集群的某一个进程执行一个定时任务。

框架并没有直接提供此功能，但开发者可以在上层框架自行扩展新的定时任务类型。

在 `agent.js` 中继承 `agent.ScheduleStrategy`，然后通过 `agent.schedule.use()` 注册即可：

``` js
module.exports = agent => {
  class ClusterStrategy extends agent.ScheduleStrategy {
    start() {
      // 订阅其他的分布式调度服务发送的消息，收到消息后让一个进程执行定时任务
      // 用户在定时任务的 schedule 配置中来配置分布式调度的场景（scene）
      agent.mq.subscribe(this.schedule.scene, () => this.sendOne());
    }
  }
  agent.schedule.use('cluster', ClusterStrategy);
};
```

`ScheduleStrategy` 基类提供了：

- `this.schedule` - 定时任务的属性，`disable` 是默认统一支持的，其他配置可以自行解析。
- `this.sendOne(...args)` - 随机通知一个 worker 执行 task，`args` 会传递给 `subscribe(...args)` 或 `task(ctx, ...args)`。
- `this.sendAll(...args)` - 通知所有的 worker 执行 task。




