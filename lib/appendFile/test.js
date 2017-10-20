const { resolve } = require('path');
const { readFileSync } = require('fs');
const test = require('tape');
const { appendFile, open, close, write } = require('../../');

const filepath = resolve(process.cwd(), './test/data/append.txt');

test('setup append', t => {
  write(filepath, 'abc')
    .then(() => t.end())
    .catch(t.end);
});

test('append def', t => {
  appendFile(filepath, 'def')
    .then(() => {
      t.pass('appended data');
      t.equal(readFileSync(filepath, 'utf8'), 'abcdef', 'contains abcdef');
      t.end();
    })
    .catch(t.end);
});

test('append ghi a buffer', t => {
  appendFile(filepath, Buffer.from('ghi'))
    .then(() => {
      t.pass('appended data');
      t.equal(
        readFileSync(filepath, 'utf8'),
        'abcdefghi',
        'contains abcdefghi'
      );
      t.end();
    })
    .catch(t.end);
});

test('append mno to fd', t => {
  open(filepath, {
    flags: 'a+'
  })
    .then(fd => {
      return appendFile(fd, 'jkl')
        .then(() => appendFile(fd, 'mno'))
        .then(() => close(fd));
    })
    .then(() => {
      t.pass('appended data to fd');
      t.equal(
        readFileSync(filepath, 'utf8'),
        'abcdefghijklmno',
        'contains abcdefghijklmno'
      );
      t.end();
    })
    .catch(t.end);
});

test('append error', t => {
  appendFile(filepath, '', {
    flag: 'r'
  })
    .then(() => {
      t.fail('should not truncate');
      t.end();
    })
    .catch(error => {
      t.true(
        /^(EBADF|EPERM)$/.test(error.code),
        'error.code is EBADF (or EPERM on Windows)'
      );
      t.end();
    });
});
