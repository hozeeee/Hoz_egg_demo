/**
 * 使用 puppeteer 创建无头浏览器
 * https://zhaoqize.github.io/puppeteer-api-zh_CN/
 */

import { Service } from 'egg';
import * as puppeteer from 'puppeteer';
import * as path from 'path';

class UsePuppeteer extends Service {

  _browser: null | puppeteer.Browser = null;

  async _createBrowser() {
    if (this._browser) return this._browser;
    const browser = await puppeteer.launch({
      // executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
      // 默认是 800x600
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      dumpio: process.env['EGG_DEBUG'] === 'true'   // 若为 true ，将浏览器控制台输出到当前控制台
    });
    this._browser = browser;
    return browser;
  }

  async _closeBrowser(browser) {
    if (this._browser) await browser.close();
    this._browser = null;
    return true;
  }

  // 测试截取百度查询到的页面
  public async bilibiliHome(searchStr?: string) {
    const res: any = {};
    console.log('------ 开始调用 puppeter ------');
    const browser = await this._createBrowser();
    const page = await browser.newPage();
    await page.goto('https://www.bilibili.com/', {
      // 以下都是默认值
      timeout: 30 * 1000, // 跳转等待时间，0 表示无限等待
      waitUntil: 'load', // 满足什么条件认为页面跳转完成
    });
    await page.focus('#nav_searchform input');
    await page.keyboard.type(searchStr);
    // 截图留念
    const partPath = '/public/puppeteer_screenshot/' + `${Date.now()}.png`;
    const _p1 = path.join(__dirname, '../', partPath);
    await page.screenshot({ path: _p1 });
    res.screenshot = partPath;
    if (!searchStr) {
      console.log('------ puppeteer 完成任务 ------');
      browser.close();
      return res;
    }
    // 打开新页面，并获取
    const newPagePromise = new Promise(resolve => {
      browser.once('targetcreated', target => {
        resolve(target.page());
      });
    });
    await page.$eval('#internationalHeader .nav-search-btn button', (_btn: any) => {
      _btn.click();
    });
    await page.close();
    const newPage = (await newPagePromise) as puppeteer.Page;
    // 截图留念_2
    if (newPage) {
      const partPath2 = '/public/puppeteer_screenshot/' + `${Date.now()}.png`;
      const _p2 = path.join(__dirname, '../', partPath2);
      if (newPage) await newPage.screenshot({ path: _p2 });
      res.screenshot2 = partPath2;
      await newPage.close();
    }
    // 关闭
    console.log('------ puppeteer 完成任务 ------');
    // browser.close();
    return res;
  }


}
export default UsePuppeteer;
