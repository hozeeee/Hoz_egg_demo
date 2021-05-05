import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  router.post('/api/demo/json', controller.api.demo.json);
  router.post('/api/demo/form', controller.api.demo.form);
  router.post('/api/demo/formData', controller.api.demo.formData);
  router.post('/api/demo/query', controller.api.demo.query);
  router.post('/api/demo/params/:foo/:baz', controller.api.demo.params);

  router.post('/api/demo/singleFile', controller.api.demo.singleFile);
  router.post('/api/demo/multiFiles', controller.api.demo.multiFiles);

  router.post('/api/login', controller.api.login.index);
  router.post('/api/logout', controller.api.login.logout);


  router.all('/puppeter/bilibili', controller.puppeter.demo.bilibiliHome);

  router.all('/nodemailer/send', controller.nodemailer.demo.send);
  router.all('/nodemailer/receive', controller.nodemailer.demo.receive);

};
