const file = require('../');

const test = require('tape');
const { resolve } = require('path');
const fs = require('fs');

const filepath1 = resolve(__dirname, './data/sync.txt');

test('sync', t => {
  fs.open(filepath1, 'w', (error, fd) => {
    t.error(error, 'no error');

    fs.write(fd, 'abcdef\n', error => {
      t.error(error, 'no error');

      file
        .sync(fd)
        .then(() => {
          t.pass('file flushed');
          fs.closeSync(fd);
          t.end();
        })
        .catch(error => {
          t.error(error);
          fs.closeSync(fd);
          t.end();
        });
    });
  });
});

test('sync error', t => {
  file
    .sync(-1)
    .then(() => {
      t.fail('should not flush');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'fsync', 'error.syscall is fsync');
      t.end();
    });
});
