const file = require('../');

const test = require('tape');
const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');

const filepath1 = resolve(__dirname, './data/truncate.txt');

test('setup truncate', t => {
  writeFileSync(filepath1, 'abcdefghijklmnopqrstuvwxyz\n');
  t.end();
});

test('truncate', t => {
  file
    .truncate(filepath1, {
      length: 9
    })
    .then(() => {
      const text = readFileSync(filepath1, 'utf8');
      t.equal(text.length, 9, 'text.length is 9');
      t.equal(text, 'abcdefghi');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('truncate with fd', t => {
  file
    .open(filepath1, {
      flags: 'r+'
    })
    .then(fd => {
      return file
        .truncate(fd, {
          length: 8
        })
        .then(() => {
          const text = readFileSync(filepath1, 'utf8');
          t.equal(text.length, 8, 'text.length is 8');
          t.equal(text, 'abcdefgh');
          return file.close(fd);
        })
        .then(t.end);
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('truncate all', t => {
  file
    .truncate(filepath1)
    .then(() => {
      const text = readFileSync(filepath1, 'utf8');
      t.equal(text.length, 0, 'text.length is 0');
      t.equal(text, '');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('truncate error', t => {
  file
    .truncate(filepath1, {
      length: -1
    })
    .then(() => {
      t.fail('should not truncate');
      t.end();
    })
    .catch(error => {
      t.true(error, error);
      t.equal(error.code, 'EINVAL', 'error.code is EINVAL');
      t.equal(error.syscall, 'ftruncate', 'error.syscall is ftruncate');
      t.end();
    });
});
