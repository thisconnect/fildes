const { resolve } = require('path');
const test = require('tape');
const { unlink, write } = require('../../');

const dir = resolve(process.cwd(), './test/data/');
const filepath1 = resolve(dir, './unlink.txt');

test('setup unlink', t => {
  write(filepath1, 'file content\n')
    .then(() => t.end())
    .catch(t.end);
});

test('unlink', t => {
  unlink(filepath1)
    .then(() => {
      t.pass('file deleted');
      t.end();
    })
    .catch(t.end);
});

test('unlink non-existing file', t => {
  const path = resolve(dir, './nothing-here.txt');

  unlink(path)
    .then(() => {
      t.fail('should not unlink non-existing file');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'instance of Error');
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'unlink', 'error.syscall is unlink');
      t.equal(error.path, path, 'correct error.path');
      t.true(
        error.message.includes('no such file or directory'),
        'includes no such file or directory message'
      );
      t.end();
    });
});
