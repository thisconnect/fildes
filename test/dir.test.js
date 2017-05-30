var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var writeFileSync = require('fs').writeFileSync;

var dirpath1 = resolve(__dirname, './data/dir/dir/sub/subsub');
var dirpath2 = resolve(__dirname, './data/dir/dir/sub');
var filepath = resolve(__dirname, './data/dir.txt');

tape('setup dirs', (t) => {
  writeFileSync(filepath, 'chmod test\n');
  t.end();
});

tape('mkdir', (t) => {
  file
    .mkdir(dirpath1)
    .then((data) => {
      t.pass('dir created');
      t.end();
    })
    .catch((error) => {
      t.error(error);
      t.end();
    });
});

tape('mkdir on file', (t) => {
  file
    .mkdir(filepath)
    .then((data) => {
      t.fail('dir created');
      t.end();
    })
    .catch((error) => {
      t.ok(error, error);
      t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
      t.equal(error.syscall, 'mkdir', 'error.syscall is mkdir');
      t.end();
    });
});

tape('mkdir error', (t) => {
  file
    .mkdir(-1)
    .then((data) => {
      t.fail('dir deleted');
      t.end();
    })
    .catch((error) => {
      t.ok(error, error);
      t.ok(error instanceof TypeError, 'is TypeError');
      t.end();
    });
});

tape('readdir', (t) => {
  var dir = resolve(__dirname, './data/dir');

  file
    .readdir(dir)
    .then((files) => {
      t.ok(files, 'has files');
      t.ok(Array.isArray(files), 'files is Array');
      t.ok(files.length > 1, 'has some files');
      t.end();
    })
    .catch((error) => {
      t.error(error);
      t.end();
    });
});

tape('readdir error', (t) => {
  var dir = resolve(__dirname, './data/dir/that/is/not/here');

  file
    .readdir(dir)
    .then((files) => {
      t.fail('should have no files');
      t.end();
    })
    .catch((error) => {
      t.ok(error, error);
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.end();
    });
});
