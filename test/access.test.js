var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var fs = require('fs');

var dir = resolve(__dirname, 'data/access');
var fileR = resolve(dir, 'file-r.txt');
var fileRW = resolve(dir, 'file-rw.txt');
var fileRWX = resolve(dir, 'file-rwx.txt');
var fileRX = resolve(dir, 'file-rx.txt');
var fileW = resolve(dir, 'file-w.txt');
var fileWX = resolve(dir, 'file-wx.txt');
var fileX = resolve(dir, 'file-x.txt');

tape('setup access', (t) => {
  file
    .mkdir(dir)
    .then(() => {
      return [
        file.write(fileR, 'this can be read', { mode: '0444' }),
        file.write(fileRW, 'read and write', { mode: '0666' }),
        file.write(fileRWX, 'read, write and exectue', { mode: '0777' }),
        file.write(fileRX, 'read and exectue', { mode: '0555' }),
        file.write(fileW, 'this can be written', { mode: '0222' }),
        file.write(fileWX, 'write and execute', { mode: '0333' }),
        file.write(fileX, 'execute only', { mode: '0111' })
      ];
    })
    .then((files) => {
      return Promise.all(files);
    })
    .then(() => {
      t.end();
    })
    .catch((error) => {
      t.error(error);
      t.end();
    });
});

tape('access without mode', (t) => {
  var files = [fileR, fileRW, fileRWX, fileRX, fileW, fileWX, fileX];

  Promise.all(
    files.map((path) => {
      return file.access(path);
    })
  )
    .catch((error) => {
      t.error(error);
      t.end();
    })
    .then(() => {
      t.pass('access correct');
    })
    .then(() => {
      var nofile = resolve(dir, 'file-does-not-exist.txt');
      files.push(nofile);
      return Promise.all(
        files.map((path) => {
          return file.access(path);
        })
      )
        .then(() => {
          t.fail('should not pass');
          t.end();
        })
        .catch((error) => {
          t.ok(error, error);
          t.ok(error instanceof Error, 'is Error');
          t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
          t.equal(error.path, nofile);
        });
    })
    .then(() => {
      t.end();
    });
});

tape('access with mode', (t) => {
  Promise.all([
    file.access(fileR, 'r'),
    file.access(fileRW, 'rw'),
    file.access(fileRWX, 'rwx'),
    file.access(fileRX, 'rx'),
    file.access(fileW, 'w'),
    file.access(fileWX, 'wx'),
    file.access(fileX, 'x')
  ])
    .then(() => {
      t.pass('access correct');
      return Promise.all([
        file.access(fileRW, 'r'),
        file.access(fileRW, 'w'),
        file.access(fileRWX, 'r'),
        file.access(fileRWX, 'rw'),
        file.access(fileRWX, 'w'),
        file.access(fileRWX, 'wx'),
        file.access(fileRWX, 'x'),
        file.access(fileRX, 'r'),
        file.access(fileRX, 'x'),
        file.access(fileWX, 'w'),
        file.access(fileWX, 'x')
      ]);
    })
    .then(() => {
      t.pass('mask partly');
      return Promise.all([
        file.access(fileRWX, fs.R_OK | fs.W_OK | fs.X_OK),
        file.access(fileRWX, {
          mode: 'rwx'
        }),
        file.access(fileRWX, {
          mode: fs.R_OK | fs.W_OK | fs.X_OK
        })
      ]);
    })
    .then(() => {
      t.pass('test option.mode');
      t.end();
    })
    .catch((error) => {
      t.error(error);
      t.end();
    });
});

tape('access error with mode', (t) => {
  Promise.all([
    file.access(fileR, 'r'),
    file.access(fileRW, fs.R_OK | fs.W_OK),
    file.access(fileRWX, { mode: 'rwx' }),
    file.access(fileRX, { mode: fs.R_OK | fs.X_OK }),
    file.access(fileW, 'w'),
    file.access(fileWX, fs.R_OK | fs.W_OK | fs.X_OK),
    file.access(fileX, { mode: 'rwx' })
  ])
    .then(() => {
      t.fail('should not pass');
      t.end();
    })
    .catch((error) => {
      t.ok(error, error);
      t.ok(error instanceof Error, 'is Error');
      t.ok(
        /^(EACCES|EPERM)$/.test(error.code),
        'error.code is EACCES (or EPERM on Windows)'
      );
      t.ok([fileWX, fileX].indexOf(error.path) > -1, 'is fileWX or fileX');
      t.end();
    });
});

tape('access fail', (t) => {
  function fail() {
    t.fail('should not pass');
    t.end();
  }

  file
    .access(fileR, 'rwx')
    .then(fail)
    .catch((error) => {
      t.ok(error, error);
      t.ok(error instanceof Error, 'is Error');
      t.ok(
        /^(EACCES|EPERM)$/.test(error.code),
        'error.code is EACCES (or EPERM on Windows)'
      );
      t.equal(error.syscall, 'access', 'error.syscall is access');
      t.equal(error.path, fileR);
    })
    .then(() => {
      return file.access(fileR, 'w').then(fail).catch((error) => {
        t.ok(error, error);
        t.ok(
          /^(EACCES|EPERM)$/.test(error.code),
          'error.code is EACCES (or EPERM on Windows)'
        );
        t.equal(error.path, fileR);
      });
    })
    .then(() => {
      if (process.platform == 'win32') {
        return;
      }
      return file
        .access(fileRX, {
          mode: 'rw'
        })
        .then(fail)
        .catch((error) => {
          t.ok(error, error);
          t.ok(error instanceof Error, 'is Error');
          t.ok(
            /^(EACCES|EPERM)$/.test(error.code),
            'error.code is EACCES (or EPERM on Windows)'
          );
          t.equal(error.path, fileRX);
        });
    })
    .then(() => {
      if (process.platform == 'win32') {
        return;
      }
      return file
        .access(fileWX, {
          mode: fs.R_OK
        })
        .then(fail)
        .catch((error) => {
          t.ok(error, error);
          t.ok(error instanceof Error, 'is Error');
          t.ok(
            /^(EACCES|EPERM)$/.test(error.code),
            'error.code is EACCES (or EPERM on Windows)'
          );
          t.equal(error.path, fileWX);
        });
    })
    .then(() => {
      t.end();
    });
});
