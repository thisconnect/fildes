var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var fs = require('fs');

var filepath1 = resolve(__dirname, './data/sync.txt');
var filepath2 = resolve(__dirname, './data/sync2.txt');

tape('sync', function(t) {
  fs.open(filepath1, 'w', function(error, fd) {
    t.error(error, 'no error');

    fs.write(fd, 'abcdef\n', function(error, written, string) {
      t.error(error, 'no error');

      file
        .sync(fd)
        .then(function() {
          t.pass('file flushed');
          fs.closeSync(fd);
          t.end();
        })
        .catch(function(error) {
          t.error(error);
          fs.closeSync(fd);
          t.end();
        });
    });
  });
});

tape('sync error', function(t) {
  file
    .sync(-1)
    .then(function() {
      t.fail('should not flush');
      t.end();
    })
    .catch(function(error) {
      t.ok(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'fsync', 'error.syscall is fsync');
      t.end();
    });
});
