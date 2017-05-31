const file = require('../');

const test = require('tape');
const resolve = require('path').resolve;
const writeFileSync = require('fs').writeFileSync;

const filepath1 = resolve(__dirname, './data/unlink.txt');

test('setup unlink', t => {
  writeFileSync(filepath1, 'file content\n');
  t.end();
});

test('unlink', t => {
  file
    .unlink(filepath1)
    .then(() => {
      t.pass('file deleted');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('unlink non-existing file', t => {
  const path = resolve(__dirname, './data/nothing-here.txt');

  file
    .unlink(path)
    .then(() => {
      t.fail('should not unlink non-existing file');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'unlink', 'error.syscall is unlink');
      t.equal(error.path, path);
      t.end();
    });
});
