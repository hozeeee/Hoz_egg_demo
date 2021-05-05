/**
 * SMTP 是发信协议；IMAP 是收信协议
 * 
 * 使用 nodemailer 发送邮件
 * https://nodemailer.com/about/
 * 
 * 使用 imap + mailparser 接收邮件
 * https://github.com/mscdex/node-imap#readme
 * https://nodemailer.com/extras/mailparser/#mailparser
 */

import { Service } from 'egg';
import * as nodemailer from 'nodemailer';
import { MailParser } from "mailparser";
const Imap = require('imap');
import * as fs from 'fs';
import * as path from 'path';


class UseNodemailer extends Service {

  public async send(toList: string[], subject: string, text: string, html?: string) {
    if (!Array.isArray(toList) || toList.length === 0 || !subject) return false;
    const myEmail = '***********@139.com';
    const transporter = nodemailer.createTransport({
      host: "smtp.139.com",
      port: 465, // 如果 secure 为 true，此参数可以忽略，默认为 465
      secure: true,
      auth: {
        user: myEmail,
        pass: '***************', // 此处不一定是密码，一般是授权码，在邮箱设置中配置
      },
    });
    const to = toList.join(', ');
    if (!to) return false;
    const info = await transporter.sendMail({
      from: myEmail,  // 注意！要与上面登录的邮箱一致！
      to,  // 发送列表，多个的格式是 "bar@example.com, baz@example.com"
      subject, // 邮件主题
      text,
      html,
    });
    return {
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    }
  }

  public async receive() {
    console.log('------------------------')
    const imapWrap = new ImapWrap({
      user: '***********@139.com',
      password: '***************',
      host: 'imap.139.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });
    await imapWrap.connect();
    const res = await imapWrap.searchLastThreeDay();
    console.log('------------------------')
    return res;
  }

}
export default UseNodemailer;



// 封装 Imap
class ImapWrap {
  imap;

  constructor(config) {
    this.imap = new Imap({
      ...config
    });
  }

  public connect() {
    if (!this.imap) return Promise.reject(null);
    const promise = new Promise((resolve, reject) => {
      this.imap.once('error', (err) => {
        reject(err);
      });
      this.imap.once('ready', async () => {
        this.imap.openBox('INBOX', true, (err, box) => {
          if (err) reject(err);
          else resolve(box);
        });
      });
    });
    this.imap.connect();
    return promise;
  }

  public searchLastThreeDay() {
    if (!this.imap) return Promise.reject(null);
    const promise = new Promise((resolve, reject) => {
      // 搜索近三天所有邮件的邮件 (具体参考 ../helper/imapEnum.ts 的内容)
      const _d = new Date(Date.now() - 3 * 24 * 3600 * 1000).toUTCString();
      this.imap.search(['ALL', ['SINCE', _d]], (err, results) => {
        if (err) return reject(err);
        const f = this.imap.fetch(results, { bodies: '' });
        const res = [];
        f.on('message', (msg, index) => {
          const mailparser = new MailParser();
          const _item: any = {}
          msg.on('body', function (stream, info) {
            _item.info = info;
            _item._finish = false;
            // 将为解析的数据流 pipe 到 mailparser
            stream.pipe(mailparser);
            // 邮件头
            mailparser.on("headers", (headers) => {
              _item.headers = {
                subject: headers.get('subject'),
                from: headers.get('from').text,
                to: headers.get('to').text,
              }
            });
            // 邮件内容
            mailparser.on("data", (data) => {
              // 正文
              if (data.type === 'text') {
                _item.data = {
                  html: data.html,
                  text: data.text
                };
              }
              _item._finish = true;
              // 附件
              if (data.type === 'attachment') {
                _item._finish = false;
                const _p = `/public/imap_attachment/${Date.now()}_${data.filename}`;
                data.content.pipe(fs.createWriteStream(path.join(__dirname, '../', _p)));
                data.content.on('end', () => {
                  _item._finish = true;
                  data.release();
                  _item.attachment = {
                    file: _p
                  };
                });
              }
            });
          });
          msg.once('end', () => {
            console.log(index, ' 已完成');
            res.push(_item);
          });
        });
        f.once('error', (err) => {
          console.error('抓取出现错误: ' + err);
        });
        f.once('end', () => {
          if (res.length === 0) return resolve(res);
          // 等待数据处理
          const _timer = setInterval(() => {
            if (!res.every(i => i._finish)) return;
            clearInterval(_timer);
            console.log('所有邮件抓取完成!');
            resolve(res);
          }, 300);
          // this.imap.end();
        });
      });
    });
    return promise;
  }
}
