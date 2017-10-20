const { resolve } = require('path');
const test = require('tape');
const { link, write, readFile } = require('../../');

const dir = resolve(process.cwd(), './test/data/');

const filepath1 = resolve(dir, './link.txt');
const filepath2 = resolve(dir, './link/link.txt');
const filepath3 = resolve(dir, './link/link2.txt');

test('setup link', t => {
  write(filepath1, 'link test\n')
    .then(() => t.end())
    .catch(t.end);
});

test('link', t => {
  link(filepath1, filepath2)
    .then(() => t.pass('file linked'))
    .then(() => readFile(filepath2, { encoding: 'utf8' }))
    .then(content => {
      t.equal(content, 'link test\n', 'link2 has content of file1');
      t.end();
    })
    .catch(t.end);
});

test('link link', t => {
  link(filepath2, filepath3)
    .then(() => t.pass('file linked'))
    .then(() => write(filepath1, 'changed\n'))
    .then(() => readFile(filepath3, { encoding: 'utf8' }))
    .then(content => {
      t.equal(content, 'changed\n', 'link3 has content of file1');
      t.end();
    })
    .catch(t.end);
});

test('link without src', t => {
  const src = resolve(dir, './not/here.txt');
  link(src, filepath2)
    .then(() => {
      t.fail('should not link');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'access', 'error.syscal is access');
      t.true(
        error.message.includes('no such file or directory'),
        'includes no such file or directory message'
      );
      t.end();
    });
});

test('link dest error', t => {
  const dest = resolve(dir, './link/link.txt/sub/not/work.txt');
  link(filepath1, dest)
    .then(() => {
      t.fail('should not link');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.true(
        /^(ENOTDIR|EEXIST)$/.test(error.code),
        'error.code is ENOENT (or EEXIST on Windows)'
      );
      t.equal(error.syscall, 'mkdir', 'error.syscal is mkdir');

      if (process.platform === 'win32') {
        t.true(
          error.message.includes('file already exists'),
          'includes file already exists message'
        );
      } else {
        t.true(
          error.message.includes('not a directory'),
          'includes not a directory message'
        );
      }
      t.end();
    });
});
