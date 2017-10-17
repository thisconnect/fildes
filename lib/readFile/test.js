const { resolve } = require('path');
const test = require('tape');
const { readFile, open, close, write } = require('../../');

const dir = resolve(process.cwd(), './test/data/');
const filepath1 = resolve(dir, './readfile.txt');

test('setup readFile', t => {
  write(filepath1, '0123456789\n')
    .then(() => t.end())
    .catch(t.end);
});

test('readFile', t => {
  readFile(filepath1)
    .then(buffer => {
      t.true(Buffer.isBuffer(buffer), 'is Buffer');
      t.deepEqual(buffer, Buffer.from('0123456789\n'));
      t.pass('file read');
      t.end();
    })
    .catch(t.end);
});

test('readFile utf8', t => {
  readFile(filepath1, {
    encoding: 'utf8'
  })
    .then(data => {
      t.equal(typeof data, 'string', 'is String');
      t.equal(data, '0123456789\n', 'got 0123456789');
      t.pass('file read');
      t.end();
    })
    .catch(t.end);
});

test('readFile from fd', t => {
  open(filepath1, {
    flags: 'r'
  })
    .then(fd => {
      return readFile(fd)
        .then(result => {
          t.equal(result.toString(), '0123456789\n', 'got 0123456789');
          return close(fd);
        })
        .then(t.end);
    })
    .catch(t.end);
});

test('readFile non-existing file', t => {
  const path = resolve(dir, './nothing-here.txt');

  readFile(path)
    .then(() => {
      t.fail('should have no data');
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
