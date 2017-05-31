const file = require('../');

const test = require('tape');
const { resolve } = require('path');
const { writeFileSync } = require('fs');

const filepath1 = resolve(__dirname, './data/readfile.txt');

test('setup readFile', t => {
  writeFileSync(filepath1, '0123456789\n');
  t.end();
});

test('readFile', t => {
  file
    .readFile(filepath1)
    .then(buffer => {
      t.true(Buffer.isBuffer(buffer), 'is Buffer');
      t.deepEqual(buffer, Buffer.from('0123456789\n'));
      t.pass('file read');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('readFile utf8', t => {
  file
    .readFile(filepath1, {
      encoding: 'utf8'
    })
    .then(data => {
      t.true(typeof data == 'string', 'is String');
      t.equal(data, '0123456789\n');
      t.pass('file read');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('readFile from fd', t => {
  file
    .open(filepath1, {
      flags: 'r'
    })
    .then(fd => {
      return file
        .readFile(fd)
        .then(result => {
          t.equal(result.toString(), '0123456789\n');
          return file.close(fd);
        })
        .then(t.end);
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('readFile non-existing file', t => {
  const path = resolve(__dirname, './data/nothing-here.txt');

  file
    .readFile(path)
    .then(() => {
      t.fail('should have no data');
      t.end();
    })
    .catch(error => {
      t.true(error, error);
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.equal(error.path, path);
      t.end();
    });
});
