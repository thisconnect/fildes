const file = require('../');

const test = require('tape');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { writeFileSync } = require('fs');

const filepath = resolve(__dirname, './data/append.txt');

test('setup append', t => {
  writeFileSync(filepath, 'abc');
  t.end();
});

test('append', t => {
  file
    .appendFile(filepath, 'def')
    .then(() => {
      t.pass('appended data');
      t.equal(readFileSync(filepath, 'utf8'), 'abcdef');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('append a buffer', t => {
  file
    .appendFile(filepath, Buffer.from('ghi'))
    .then(() => {
      t.pass('appended data');
      t.equal(readFileSync(filepath, 'utf8'), 'abcdefghi');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('append to fd', t => {
  file
    .open(filepath, {
      flags: 'a+'
    })
    .then(fd => {
      return file.appendFile(fd, 'jkl').then(() => fd);
    })
    .then(fd => file.appendFile(fd, 'mno'))
    // .then(fd => file.close(fd))
    .then(() => {
      t.pass('appended data to fd');
      t.equal(readFileSync(filepath, 'utf8'), 'abcdefghijklmno');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('append error', t => {
  file
    .appendFile(filepath, '', {
      flag: 'r'
    })
    .then(() => {
      t.fail('should not truncate');
      t.end();
    })
    .catch(error => {
      t.true(error, error);
      t.true(
        /^(EBADF|EPERM)$/.test(error.code),
        'error.code is EBADF (or EPERM on Windows)'
      );
      t.end();
    });
});
