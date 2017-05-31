var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;
var writeFileSync = require('fs').writeFileSync;

var filepath1 = resolve(__dirname, './data/rename1.txt');
var filepath2 = resolve(__dirname, './data/rename2.txt');

tape('setup rename', t => {
  writeFileSync(filepath1, '0123456789\n');
  t.end();
});

tape('rename', t => {
  file
    .rename(filepath1, filepath2)
    .then(() => {
      t.pass('renamed file');
      t.equal(readFileSync(filepath2, { encoding: 'utf8' }), '0123456789\n');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('rename error', t => {
  file
    .rename('./does/not/exits.txt', './there/is/no/such/dir/file.txt')
    .then(() => {
      t.fail('should not rename');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.end();
    });
});
