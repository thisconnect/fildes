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
    .appendFile(filepath, new Buffer('ghi'))
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
      t.ok(error, error);
      t.ok(
        /^(EBADF|EPERM)$/.test(error.code),
        'error.code is EBADF (or EPERM on Windows)'
      );
      t.end();
    });
});
