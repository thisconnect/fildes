const file = require('../');

const tape = require('tape');
const resolve = require('path').resolve;
const readFileSync = require('fs').readFileSync;

const filepath1 = resolve(__dirname, './data/write.json');
const filepath2 = resolve(__dirname, './data/write.txt');
const filepath3 = resolve(__dirname, './data/write2.txt');
const filepath4 = resolve(__dirname, './data/dir/write/write3.txt');

tape('write JSON', t => {
  file
    .write(filepath1, { data: 1 })
    .then(() => {
      t.pass('file written');
      t.equal(readFileSync(filepath1, 'utf8'), '{"data":1}');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('write buffer', t => {
  file
    .write(filepath2, new Buffer('Hi!'), {
      offset: 0,
      length: 3
    })
    .then(() => {
      t.pass('file written');
      t.equal(readFileSync(filepath2, 'utf8'), 'Hi!');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('write string at position', t => {
  file
    .write(filepath3, 'foo bar baz')
    .then(() => {
      t.pass('file written');
      t.equal(readFileSync(filepath3, 'utf8'), 'foo bar baz');

      return file
        .write(filepath3, 'bOz', {
          // 'flags': 'r+'
          position: 8
        })
        .then(() => {
          t.pass('file written');
          t.equal(readFileSync(filepath3, 'utf8'), 'foo bar bOz');
          t.end();
        });
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('write buffer at position', t => {
  file
    .write(filepath3, 'foo bar baz')
    .then(() => {
      return file
        .write(filepath3, new Buffer('bOz'), {
          flags: 'r+', // fails with 'w' or 'w+'
          offset: 0,
          length: 3,
          position: 8
        })
        .then(() => {
          t.pass('file written');
          t.equal(readFileSync(filepath3, 'utf8'), 'foo bar bOz');
          t.end();
        });
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('write file in a new directory', t => {
  file
    .write(filepath4, 'test\n')
    .then(() => {
      t.pass('file written');
      t.equal(readFileSync(filepath4, 'utf8'), 'test\n');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('write twice with manually opened fd', t => {
  file
    .open(filepath2)
    .then(fd => {
      return file
        .write(fd, 'Hi there!')
        .then(() => {
          return file.write(fd, new Buffer('again'), {
            offset: 0,
            length: 5,
            position: 3
          });
        })
        .then(() => {
          return file.close(fd);
        });
    })
    .then(() => {
      t.pass('file written');
      t.equal(readFileSync(filepath2, 'utf8'), 'Hi again!');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('write with invalid offset', t => {
  file
    .write(filepath2, new Buffer(0), {
      offset: -1
    })
    .then(() => {
      t.fail('file written');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.ok(error instanceof RangeError, 'is RangeError');
      t.end();
    });
});

tape('write buffer fd error', t => {
  file
    .write(-1, new Buffer(0))
    .then(() => {
      t.fail('should have no data');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'write', 'error.syscall is write');
      t.end();
    });
});

tape('write fd error', t => {
  file
    .write(-1)
    .then(() => {
      t.fail('should have no data');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'write', 'error.syscall is write');
      t.end();
    });
});
