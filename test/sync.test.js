var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var fs = require('fs');

var filepath1 = resolve(__dirname, './data/sync.txt');

tape('sync', t => {
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

tape('sync error', t => {
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
