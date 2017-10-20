const { resolve } = require('path');
const test = require('tape');
const { readdir, write } = require('../../');

const dir = resolve(process.cwd(), './test/data/readdir/');
const filepath = resolve(dir, './file.txt');

test('setup readdir', t => {
  write(filepath, 'content\n')
    .then(() => t.end())
    .catch(t.end);
});

test('readdir', t => {
  readdir(dir)
    .then(files => {
      t.true(files, 'has files');
      t.true(Array.isArray(files), 'files is Array');
      t.true(files.length > 0, 'has some files');
      t.true(files.includes('file.txt'), 'has file.txt');
      t.end();
    })
    .catch(t.end);
});

test('readdir  error', t => {
  const nodir = resolve(dir, './nothere/');
  readdir(nodir)
    .then(() => {
      t.fail('should read directory that is not there');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'scandir', 'error.syscall is scandir');
      t.equal(error.path, nodir, 'correct error.path');
      t.true(
        error.message.includes('no such file or directory'),
        'includes no such file or directory message'
      );
      t.end();
    });
});

test('readdir error', t => {
  readdir(filepath)
    .then(() => {
      t.fail('should read directory that is not there');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'ENOTDIR', 'error.code is ENOTDIR');
      t.equal(error.syscall, 'scandir', 'error.syscall is scandir');
      t.equal(error.path, filepath, 'correct error.path');
      t.true(
        error.message.includes('not a directory'),
        'includes not a directory message'
      );
      t.end();
    });
});
