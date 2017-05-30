var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;
var writeFileSync = require('fs').writeFileSync;

var filepath = resolve(__dirname, './data/append.txt');

tape('setup append', (t) => {
  writeFileSync(filepath, 'abc');
  t.end();
});

tape('append', (t) => {
  file
    .appendFile(filepath, 'def')
    .then(() => {
      t.pass('appended data');
      t.equal(readFileSync(filepath, 'utf8'), 'abcdef');
      t.end();
    })
    .catch((error) => {
      t.error(error);
      t.end();
    });
});

tape('append a buffer', (t) => {
  file
    .appendFile(filepath, new Buffer('ghi'))
    .then(() => {
      t.pass('appended data');
      t.equal(readFileSync(filepath, 'utf8'), 'abcdefghi');
      t.end();
    })
    .catch((error) => {
      t.error(error);
      t.end();
    });
});

tape('append error', (t) => {
  file
    .appendFile(filepath, '', {
      flag: 'r'
    })
    .then(() => {
      t.fail('should not truncate');
      t.end();
    })
    .catch((error) => {
      t.ok(error, error);
      t.ok(
        /^(EBADF|EPERM)$/.test(error.code),
        'error.code is EBADF (or EPERM on Windows)'
      );
      t.end();
    });
});
