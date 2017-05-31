const file = require('../');

const test = require('tape');
const resolve = require('path').resolve;

const filepath1 = resolve(__dirname, './data/dir/open/open.txt');
const filepath2 = resolve(__dirname, './data/open.txt');

// 'w' - Open file for writing.
// The file is created (if it does not exist)
// or truncated (if it exists).
test('open w file and dir created', t => {
  file
    .open(filepath1, {
      flags: 'w'
    })
    .then(fd => {
      t.ok(fd, 'has file descriptor');
      t.equal(typeof fd, 'number', 'fd is Number');
      return file.close(fd);
    })
    .then(() => {
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

// 'wx' - Open file for writing.
// Fails if path exists.
test('open wx (fails if path exists)', t => {
  file
    .open(filepath2, {
      flags: 'wx'
    })
    .then(fd => {
      t.ok(fd, 'has file descriptor');
      t.equal(typeof fd, 'number', 'fd is Number');
      return file.close(fd);
    })
    .then(() => {
      return file.open(filepath2, {
        flags: 'wx'
      });
    })
    .then(() => {
      t.fail('should fail');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.end();
    });
});

test('open twice', t => {
  file
    .open(filepath2)
    .then(fd1 => {
      return file
        .open(filepath2)
        .then(fd2 => {
          t.ok(fd1, 'has file descriptor 1');
          t.ok(fd2, 'has file descriptor 2');
          t.equal(typeof fd1, 'number', 'fd1 is Number');
          t.equal(typeof fd2, 'number', 'fd2 is Number');
          return Promise.all([file.close(fd1), file.close(fd2)]);
        })
        .then(() => {
          t.end();
        });
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

// 'r' - Open file for reading.
// An exception occurs if the file does not exist.
test('open r', t => {
  const path = resolve(__dirname, './data/not/here.txt');
  file
    .open(path, {
      flags: 'r'
    })
    .then(() => {
      t.fail('should not return fd');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.equal(error.path, path);
      t.end();
    });
});

// 'wx+' - Open file for reading and writing.
// Fails if path exists.
test('open wx+ error', t => {
  const path = resolve(__dirname, './data/not/here.txt');
  file
    .open(path, {
      flags: 'wx+'
    })
    .then(() => {
      t.fail('should not return fd');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.equal(error.path, path);
      t.end();
    });
});

test('close', t => {
  file
    .close(-1)
    .then(() => {
      t.fail('should not close nothing');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'close', 'error.syscall is close');
      t.end();
    });
});

test('close twice', t => {
  file
    .open(filepath2)
    .then(fd => {
      return file.close(fd).then(() => {
        t.pass('close first time');
        return file.close(fd);
      });
    })
    .then(() => {
      t.fail('should not close twice');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'close', 'error.syscall is close');
      t.end();
    });
});

// 'wx+' - Open file for reading and writing.
// Fails if path exists.
test('open one fd with wx+ at the time', t => {
  const path = resolve(__dirname, './data/open-this-only-once.txt');
  file
    .open(path, {
      flags: 'wx+'
    })
    .then(fd => {
      // ready to write data to the fd
      t.ok(fd, 'has file descriptor');
      t.equal(typeof fd, 'number', 'fd is Number');
      // opening the same path again with wx+ errors,
      // since file already exists
      return file
        .open(path, {
          flags: 'wx+'
        })
        .then(() => {
          t.fail('should not open since file already exists');
        })
        .catch(error => {
          // expect an error since file path has been openend / created
          t.ok(error, error);
          // close the fd
          return file.close(fd);
        })
        .then(() => {
          t.end();
        });
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});
