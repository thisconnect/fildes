const { resolve } = require('path');
const test = require('tape');
const { rename, readFile, write } = require('../../');

const dir = resolve(process.cwd(), './test/data/');
const filepath1 = resolve(dir, './rename1.txt');
const filepath2 = resolve(dir, './rename2.txt');

test('setup rename', t => {
  write(filepath1, '0123456789\n')
    .then(() => t.end())
    .catch(t.end);
});

test('rename', t => {
  rename(filepath1, filepath2)
    .then(() => {
      t.pass('renamed file');
      return readFile(filepath2, { encoding: 'utf8' });
    })
    .then(content => {
      t.equal(content, '0123456789\n', 'file exists and has content of file1');
      t.end();
    })
    .catch(t.end);
});

test('rename error', t => {
  rename('./does/not/exits.txt', './there/is/no/such/dir/file.txt')
    .then(() => {
      t.fail('should not rename');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'rename', 'error.syscall is rename');
      t.equal(
        resolve(error.path),
        resolve('./does/not/exits.txt'),
        'correct error.path'
      );
      t.true(
        error.message.includes('no such file or directory'),
        'includes no such file or directory message'
      );
      t.end();
    });
});
