// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportSimpleLoginList from '../../../app/service/SimpleLoginList';
import ExportTest from '../../../app/service/Test';
import ExportUseNodemailer from '../../../app/service/UseNodemailer';
import ExportUsePuppeteer from '../../../app/service/UsePuppeteer';

declare module 'egg' {
  interface IService {
    simpleLoginList: AutoInstanceType<typeof ExportSimpleLoginList>;
    test: AutoInstanceType<typeof ExportTest>;
    useNodemailer: AutoInstanceType<typeof ExportUseNodemailer>;
    usePuppeteer: AutoInstanceType<typeof ExportUsePuppeteer>;
  }
}
