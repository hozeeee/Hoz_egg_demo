import { mock } from 'egg-mock/bootstrap';
import * as assert from "assert";
import * as fs from 'fs';

// 当 [egg-mock](https://github.com/eggjs/egg-mock) 提供的 api 不足及满足需求，
// 可以使用 [mm](https://github.com/node-modules/mm) 自带的 mock 功能，因为 egg-mock 是基于 mm 框架。
describe('test mock', () => {

  // mock 方法
  it('mock function', () => {
    const _fs = fs as any;
    mock(_fs, 'readFileSync', (filename: string) => {
      return filename;
    });
    assert(_fs.readFileSync('hello world') === 'hello world');
  });

  // mock 错误
  it('mock error', () => {
    mock.error(fs, 'readFile', 'mock fs.readFile return error');
    fs.readFile('/foo/baz', 'utf8', function (_err) {
      console.log('fs.readFile---error');
    });
  });

});
