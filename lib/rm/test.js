const test = require('tape');
const { resolve } = require('path');
const { mkdir, rm } = require('../../');

const dir = resolve(process.cwd(), './test/data/rm');

test('setup rm', t => {
  mkdir(dir)
    .then(() => t.end())
    .catch(t.end);
});

test('rm', t => {
  rm(dir)
    .then(() => {
      t.pass('dir deleted');
      t.end();
    })
    .catch(t.end);
});

test('rm error', t => {
  rm(-1)
    .then(() => {
      t.fail('should not delete not existing dir');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.true(
        error.message.includes('must be a string or an array of strings'),
        'includes must be a string or an array of strings message'
      );
      t.end();
    });
});
