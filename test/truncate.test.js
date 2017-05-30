var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;
var writeFileSync = require('fs').writeFileSync;

var filepath1 = resolve(__dirname, './data/truncate.txt');

tape('setup truncate', t => {
  writeFileSync(filepath1, 'abcdefghijklmnopqrstuvwxyz\n');
  t.end();
});

tape('truncate', t => {
  file
    .truncate(filepath1, {
      length: 9
    })
    .then(() => {
      var text = readFileSync(filepath1, 'utf8');
      t.equal(text.length, 9, 'text.length is 9');
      t.equal(text, 'abcdefghi');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('truncate all', t => {
  file
    .truncate(filepath1)
    .then(() => {
      var text = readFileSync(filepath1, 'utf8');
      t.equal(text.length, 0, 'text.length is 0');
      t.equal(text, '');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('truncate error', t => {
  file
    .truncate(filepath1, {
      length: -1
    })
    .then(() => {
      t.fail('should not truncate');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EINVAL', 'error.code is EINVAL');
      t.equal(error.syscall, 'ftruncate', 'error.syscall is ftruncate');
      t.end();
    });
});
