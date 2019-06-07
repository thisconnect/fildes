const { resolve } = require('path');
const test = require('tape');
const { mkdir, write } = require('../../');

const dir = resolve(process.cwd(), './test/data/mkdir/');

test('mkdir', t => {
  mkdir(resolve(dir, './sub/sub/sub'))
    .then(() => {
      t.pass('recursive dirs created');
      t.end();
    })
    .catch(t.end);
});

test('mkdir on file', t => {
  const filepath = resolve(dir, './file.txt');
  write(filepath, 'mkdir test\n')
    .then(() => mkdir(filepath))
    .then(() => {
      t.fail('dir created');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
      t.equal(error.syscall, 'mkdir', 'error.syscall is mkdir');
      if (error.path) t.equal(error.path, filepath, 'correct error.path');
      t.true(
        error.message.includes('file already exists'),
        'includes file already exists message'
      );
      t.end();
    });
});

test('mkdir error', t => {
  mkdir(-1)
    .then(() => {
      t.fail('should not create dir');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof TypeError, 'is TypeError');
      t.end();
    });
});
