const { resolve } = require('path');
const test = require('tape');
const { open, close } = require('../../');

const dir = resolve(process.cwd(), './test/data/');
const filepath1 = resolve(dir, './dir/open/open.txt');
const filepath2 = resolve(dir, './open.txt');

// 'w' - Open file for writing.
// The file is created (if it does not exist)
// or truncated (if it exists).
test('open w file and dir created', t => {
  open(filepath1, {
    flags: 'w'
  })
    .then(fd => {
      t.true(fd, 'has file descriptor');
      t.equal(typeof fd, 'number', 'fd is Number');
      return close(fd);
    })
    .then(() => t.end())
    .catch(t.end);
});

// 'wx' - Open file for writing.
// Fails if path exists.
test('open wx (fails if path exists)', t => {
  open(filepath2, {
    flags: 'wx'
  })
    .then(fd => {
      t.true(fd, 'has file descriptor');
      t.equal(typeof fd, 'number', 'fd is Number');
      return close(fd);
    })
    .then(() => open(filepath2, { flags: 'wx' }))
    .then(() => {
      t.fail('should fail');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.equal(error.path, filepath2, 'correct error.path');
      t.true(
        error.message.includes('file already exists'),
        'includes file already exists message'
      );
      t.end();
    });
});

test('open twice', t => {
  open(filepath2)
    .then(fd1 => {
      return open(filepath2)
        .then(fd2 => {
          t.true(fd1, 'has file descriptor 1');
          t.true(fd2, 'has file descriptor 2');
          t.equal(typeof fd1, 'number', 'fd1 is Number');
          t.equal(typeof fd2, 'number', 'fd2 is Number');
          return Promise.all([close(fd1), close(fd2)]);
        })
        .then(() => t.end());
    })
    .catch(t.end);
});

// 'r' - Open file for reading.
// An exception occurs if the file does not exist.
test('open r', t => {
  const path = resolve(dir, './not/here.txt');
  open(path, {
    flags: 'r'
  })
    .then(() => {
      t.fail('should not return fd');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.equal(error.path, path, 'correct error.path');
      t.true(
        error.message.includes('no such file or directory'),
        'includes no such file or directory message'
      );
      t.end();
    });
});

// 'wx+' - Open file for reading and writing.
// Fails if path exists.
test('open wx+ error', t => {
  const path = resolve(dir, './not/here.txt');
  open(path, {
    flags: 'wx+'
  })
    .then(() => {
      t.fail('should not return fd');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.equal(error.path, path, 'correct error.path');
      t.true(
        error.message.includes('no such file or directory'),
        'includes no such file or directory message'
      );
      t.end();
    });
});

test('close', t => {
  close(-1)
    .then(() => {
      t.fail('should not close nothing');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'close', 'error.syscall is close');
      t.true(
        error.message.includes('bad file descriptor'),
        'includes bad file descriptor message'
      );
      t.end();
    });
});

test('close twice', t => {
  open(filepath2)
    .then(fd => {
      return close(fd).then(() => {
        t.pass('close first time');
        return close(fd);
      });
    })
    .then(() => {
      t.fail('should not close twice');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'close', 'error.syscall is close');
      t.true(
        error.message.includes('bad file descriptor'),
        'includes bad file descriptor message'
      );
      t.end();
    });
});

// 'wx+' - Open file for reading and writing.
// Fails if path exists.
test('open one fd with wx+ at the time', t => {
  const path = resolve(dir, './open-this-only-once.txt');
  open(path, {
    flags: 'wx+'
  })
    .then(fd => {
      // ready to write data to the fd
      t.true(fd, 'has file descriptor');
      t.equal(typeof fd, 'number', 'fd is Number');
      // opening the same path again with wx+ errors,
      // since file already exists
      return open(path, {
        flags: 'wx+'
      })
        .then(() => {
          t.fail('should not open since file already exists');
        })
        .catch(error => {
          t.true(error instanceof Error, 'is Error');
          // expect an error since file path has been openend / created
          t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
          t.equal(error.syscall, 'open', 'error.syscall is open');
          t.true(
            error.message.includes('file already exists'),
            'includes file already exists message'
          );
          return close(fd);
        })
        .then(() => t.end());
    })
    .catch(t.end);
});
