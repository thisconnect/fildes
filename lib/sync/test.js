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
      t.true(
        /^(ERR_OUT_OF_RANGE|EBADF)$/.test(error.code),
        'error.code is ERR_OUT_OF_RANGE (or EBADF on node < 10)'
      );
      t.end();
    });
});
