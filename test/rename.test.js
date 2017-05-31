const file = require('../');

const test = require('tape');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { writeFileSync } = require('fs');

const filepath1 = resolve(__dirname, './data/rename1.txt');
const filepath2 = resolve(__dirname, './data/rename2.txt');

test('setup rename', t => {
  writeFileSync(filepath1, '0123456789\n');
  t.end();
});

test('rename', t => {
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

test('rename error', t => {
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
