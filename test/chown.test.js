var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var statSync = require('fs').statSync;
var writeFileSync = require('fs').writeFileSync;

var filepath = resolve(__dirname, './data/chown.txt');

if (process.platform != 'win32') {
  tape('setup chown', function(t) {
    writeFileSync(filepath, 'chown test\n');
    t.end();
  });

  tape('chown', function(t) {
    file
      .chown(filepath)
      .then(function() {
        var stats = statSync(filepath);
      })
      .then(function() {
        var stats = statSync(filepath);

        t.equal(stats.uid, process.getuid(), 'uid is process.getuid');
        t.equal(stats.gid, process.getgid(), 'gid is process.getgid');
        t.end();
      })
      .catch(function(error) {
        t.error(error);
        t.end();
      });
  });

  tape('chown error', function(t) {
    file
      .chown(-1)
      .then(function() {
        t.fail('should not chown');
        t.end();
      })
      .catch(function(error) {
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'fchown', 'error.syscal is fchown');
        t.end();
      });
  });
}
