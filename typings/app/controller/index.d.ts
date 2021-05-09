// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportApiDemo from '../../../app/controller/api/demo';
import ExportApiLogin from '../../../app/controller/api/login';
import ExportHttpClientDemo from '../../../app/controller/httpClient/demo';
import ExportNodemailerDemo from '../../../app/controller/nodemailer/demo';
import ExportPuppeteerDemo from '../../../app/controller/puppeteer/demo';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    api: {
      demo: ExportApiDemo;
      login: ExportApiLogin;
    }
    httpClient: {
      demo: ExportHttpClientDemo;
    }
    nodemailer: {
      demo: ExportNodemailerDemo;
    }
    puppeteer: {
      demo: ExportPuppeteerDemo;
    }
  }
}
