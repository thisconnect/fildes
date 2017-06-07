const { resolve } = require('path');
const test = require('tape');
const { open, write, close, readFile } = require('../../');

const dir = resolve(process.cwd(), './test/data/');
const filepath1 = resolve(dir, './write.json');
const filepath2 = resolve(dir, './write.txt');
const filepath3 = resolve(dir, './write2.txt');
const filepath4 = resolve(dir, './dir/write/write3.txt');

test('write JSON', t => {
  write(filepath1, { data: 1 })
    .then(() => readFile(filepath1, 'utf8'))
    .then(content => {
      t.equal(content, '{"data":1}', 'content contains JSON data');
      t.end();
    })
    .catch(t.end);
});

test('write buffer', t => {
  write(filepath2, Buffer.from('Hi!'), {
    offset: 0,
    length: 3
  })
    .then(() => readFile(filepath2, 'utf8'))
    .then(content => {
      t.equal(content, 'Hi!', 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('write string at position', t => {
  write(filepath3, 'foo bar baz')
    .then(() => {
      return write(filepath3, 'bOz', {
        // 'flags': 'r+'
        position: 8
      });
    })
    .then(() => readFile(filepath3, 'utf8'))
    .then(content => {
      t.equal(content, 'foo bar bOz', 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('write buffer at position', t => {
  write(filepath3, 'foo bar baz')
    .then(() => {
      return write(filepath3, Buffer.from('bOz'), {
        flags: 'r+', // fails with 'w' or 'w+'
        offset: 0,
        length: 3,
        position: 8
      });
    })
    .then(() => readFile(filepath3, 'utf8'))
    .then(content => {
      t.equal(content, 'foo bar bOz', 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('write file in a new directory', t => {
  write(filepath4, 'test\n')
    .then(() => readFile(filepath4, 'utf8'))
    .then(content => {
      t.equal(content, 'test\n', 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('write twice with manually opened fd', t => {
  open(filepath2)
    .then(fd => {
      return write(fd, 'Hi there!')
        .then(() => {
          return write(fd, Buffer.from('again'), {
            offset: 0,
            length: 5,
            position: 3
          });
        })
        .then(() => close(fd));
    })
    .then(() => readFile(filepath2, 'utf8'))
    .then(content => {
      t.equal(content, 'Hi again!', 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('write with invalid offset', t => {
  write(filepath2, Buffer.alloc(0), {
    offset: -1
  })
    .then(() => {
      t.fail('file written');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof RangeError, 'is RangeError');
      t.true(
        error.message.includes('offset out of bounds'),
        'includes offset out of bounds message'
      );
      t.end();
    });
});

test('write buffer fd error', t => {
  write(-1, Buffer.alloc(0))
    .then(() => {
      t.fail('should have no data');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'instance of Error');
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'write', 'error.syscall is write');
      t.true(
        error.message.includes('bad file descriptor'),
        'includes bad file descriptor message'
      );
      t.end();
    });
});

test('write fd error', t => {
  write(-1)
    .then(() => {
      t.fail('should have no data');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'instance of Error');
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'write', 'error.syscall is write');
      t.true(
        error.message.includes('bad file descriptor'),
        'includes bad file descriptor message'
      );
      t.end();
    });
});
