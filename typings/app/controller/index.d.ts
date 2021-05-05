// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportApiDemo from '../../../app/controller/api/demo';
import ExportApiLogin from '../../../app/controller/api/login';
import ExportNodemailerDemo from '../../../app/controller/nodemailer/demo';
import ExportPuppeterDemo from '../../../app/controller/puppeter/demo';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    api: {
      demo: ExportApiDemo;
      login: ExportApiLogin;
    }
    nodemailer: {
      demo: ExportNodemailerDemo;
    }
    puppeter: {
      demo: ExportPuppeterDemo;
    }
  }
}
