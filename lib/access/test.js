const { resolve } = require('path');
const fs = require('fs');
const test = require('tape');
const { access, write } = require('../../');

const dir = resolve(process.cwd(), 'test/data/access');
const fileR = resolve(dir, 'file-r.txt');
const fileRW = resolve(dir, 'file-rw.txt');
const fileRWX = resolve(dir, 'file-rwx.txt');
const fileRX = resolve(dir, 'file-rx.txt');
const fileW = resolve(dir, 'file-w.txt');
const fileWX = resolve(dir, 'file-wx.txt');
const fileX = resolve(dir, 'file-x.txt');

test('setup access', t => {
  Promise.all([
    write(fileR, 'this can be read', { mode: '0444' }),
    write(fileRW, 'read and write', { mode: '0666' }),
    write(fileRWX, 'read, write and exectue', { mode: '0777' }),
    write(fileRX, 'read and exectue', { mode: '0555' }),
    write(fileW, 'this can be written', { mode: '0222' }),
    write(fileWX, 'write and execute', { mode: '0333' }),
    write(fileX, 'execute only', { mode: '0111' })
  ])
    .then(() => t.end())
    .catch(t.end);
});

test('access without mode', t => {
  const files = [fileR, fileRW, fileRWX, fileRX, fileW, fileWX, fileX];

  Promise.all(files.map(path => access(path)))
    .then(() => t.pass('access correct'))
    .then(() => {
      const nofile = resolve(dir, 'file-does-not-exist.txt');
      files.push(nofile);
      return Promise.all(files.map(path => access(path)))
        .then(() => {
          t.fail('should not pass');
          t.end();
        })
        .catch(error => {
          t.true(error instanceof Error, 'is Error');
          t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
          t.equal(error.syscall, 'access', 'error.syscall is access');
          t.equal(error.path, nofile, 'correct error.path');
          t.true(
            error.message.includes('no such file or directory'),
            'includes no such file or directory message'
          );
        });
    })
    .then(() => t.end())
    .catch(t.end);
});

test('access with mode', t => {
  Promise.all([
    access(fileR, 'r'),
    access(fileRW, 'rw'),
    access(fileRWX, 'rwx'),
    access(fileRX, 'rx'),
    access(fileW, 'w'),
    access(fileWX, 'wx'),
    access(fileX, 'x')
  ])
    .then(() => {
      t.pass('access correct');
      return Promise.all([
        access(fileRW, 'r'),
        access(fileRW, 'w'),
        access(fileRWX, 'r'),
        access(fileRWX, 'rw'),
        access(fileRWX, 'w'),
        access(fileRWX, 'wx'),
        access(fileRWX, 'x'),
        access(fileRX, 'r'),
        access(fileRX, 'x'),
        access(fileWX, 'w'),
        access(fileWX, 'x')
      ]);
    })
    .then(() => {
      t.pass('mask partly');
      return Promise.all([
        access(fileRWX, fs.R_OK | fs.W_OK | fs.X_OK),
        access(fileRWX, {
          mode: 'rwx'
        }),
        access(fileRWX, {
          mode: fs.R_OK | fs.W_OK | fs.X_OK
        })
      ]);
    })
    .then(() => {
      t.pass('test option.mode');
      t.end();
    })
    .catch(t.end);
});

test('access error with mode', t => {
  Promise.all([
    access(fileR, 'r'),
    access(fileRW, fs.R_OK | fs.W_OK),
    access(fileRWX, { mode: 'rwx' }),
    access(fileRX, { mode: fs.R_OK | fs.X_OK }),
    access(fileW, 'w'),
    access(fileWX, fs.R_OK | fs.W_OK | fs.X_OK),
    access(fileX, { mode: 'rwx' })
  ])
    .then(() => {
      t.fail('should not pass');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.true(
        /^(EACCES|EPERM)$/.test(error.code),
        'error.code is EACCES (or EPERM on Windows)'
      );
      t.true([fileWX, fileX].includes(error.path), 'correct error.path');
      t.equal(error.syscall, 'access', 'error.syscall is access');

      if (process.platform === 'win32') {
        t.true(
          error.message.includes('operation not permitted'),
          'includes operation not permitted message'
        );
      } else {
        t.true(
          error.message.includes('permission denied'),
          'includes permission denied message'
        );
      }
      t.end();
    });
});

test('access fail', t => {
  function fail() {
    t.fail('should not pass');
    t.end();
  }

  access(fileR, 'rwx')
    .then(fail)
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.true(
        /^(EACCES|EPERM)$/.test(error.code),
        'error.code is EACCES (or EPERM on Windows)'
      );
      t.equal(error.syscall, 'access', 'error.syscall is access');
      t.equal(error.path, fileR, 'correct error.path');

      if (process.platform === 'win32') {
        t.true(
          error.message.includes('operation not permitted'),
          'includes operation not permitted message'
        );
      } else {
        t.true(
          error.message.includes('permission denied'),
          'includes permission denied message'
        );
      }
    })
    .then(() => {
      return access(fileR, 'w')
        .then(fail)
        .catch(error => {
          t.true(error instanceof Error, 'is Error');
          t.true(
            /^(EACCES|EPERM)$/.test(error.code),
            'error.code is EACCES (or EPERM on Windows)'
          );
          t.equal(error.syscall, 'access', 'error.syscall is access');
          t.equal(error.path, fileR, 'correct error.path');

          if (process.platform === 'win32') {
            t.true(
              error.message.includes('operation not permitted'),
              'includes operation not permitted message'
            );
          } else {
            t.true(
              error.message.includes('permission denied'),
              'includes permission denied message'
            );
          }
        });
    })
    .then(() => {
      if (process.platform == 'win32') {
        return;
      }
      return access(fileRX, {
        mode: 'rw'
      })
        .then(fail)
        .catch(error => {
          t.true(error instanceof Error, 'is Error');
          t.true(
            /^(EACCES|EPERM)$/.test(error.code),
            'error.code is EACCES (or EPERM on Windows)'
          );
          t.equal(error.syscall, 'access', 'error.syscall is access');
          t.equal(error.path, fileRX, 'correct error.path');

          t.true(
            error.message.includes('permission denied'),
            'includes permission denied message'
          );
        });
    })
    .then(() => {
      if (process.platform == 'win32') {
        return;
      }
      return access(fileWX, {
        mode: fs.R_OK
      })
        .then(fail)
        .catch(error => {
          t.true(error instanceof Error, 'is Error');
          t.true(
            /^(EACCES|EPERM)$/.test(error.code),
            'error.code is EACCES (or EPERM on Windows)'
          );
          t.equal(error.syscall, 'access', 'error.syscall is access');
          t.equal(error.path, fileWX, 'correct error.path');

          t.true(
            error.message.includes('permission denied'),
            'includes permission denied message'
          );
        });
    })
    .then(() => t.end())
    .catch(t.end);
});
