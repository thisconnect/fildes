const { resolve } = require('path');
const test = require('tape');
const fs = require('fs');
const { sync } = require('../../');

const filepath1 = resolve(process.cwd(), './test/data/sync.txt');

test('sync', t => {
  fs.open(filepath1, 'w', (error, fd) => {
    t.error(error, 'no error');

    fs.write(fd, 'abcdef\n', error => {
      t.error(error, 'no error');

      sync(fd)
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
  sync(-1)
    .then(() => {
      t.fail('should not flush');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'instance of Error');
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'fsync', 'error.syscall is fsync');
      t.true(
        error.message.includes('bad file descriptor'),
        'includes bad file descriptor message'
      );
      t.end();
    });
});
