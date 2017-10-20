const { resolve } = require('path');
const test = require('tape');
const { lstatSync } = require('fs');
const {
  symlink,
  write,
  writeFile,
  readdir,
  readFile,
  mkdir
} = require('../../');

const dir = resolve(process.cwd(), './test/data/');

const dest1 = resolve(dir, './symlink.txt');
const dest2 = resolve(dir, './symlink/dest.txt');
const filepath1 = resolve(dir, './symlink/symlink.txt');
const filepath2 = resolve(dir, './symlink/symlink2.txt');
const dir1 = resolve(dir, './symlink/dir1');
const dir2 = resolve(dir, './symlink/dir2');

// Exclude symlink tests for now
// test pass with administrators permisison
if (process.platform != 'win32') {
  test('setup symlink', t => {
    write(dest1, 'symlink test\n')
      .then(() => t.end())
      .catch(t.end);
  });

  test('symlink', t => {
    symlink(dest1, filepath1)
      .then(() => {
        t.pass('file symlinked');
        return readFile(filepath1, { encoding: 'utf8' });
      })
      .then(content => {
        t.equal(content, 'symlink test\n', 'symlink has content of dest1');
        t.end();
      })
      .catch(t.end);
  });

  test('symlink dir', t => {
    const file1 = resolve(dir1, 'file.txt');
    const file2 = resolve(dir2, 'file.txt');

    mkdir(dir1)
      .then(() => symlink(dir1, dir2))
      .then(() => writeFile(file1, 'test in dir1'))
      .then(() => {
        t.pass('dir symlinked');
        return readdir(dir2);
      })
      .then(files => {
        t.true(Array.isArray(files), 'files is Array');
        t.equal(files.length, 1, 'has some files');
        t.equal(files[0], 'file.txt', 'dir 2 has file.txt');
        return readFile(file2, { encoding: 'utf8' });
      })
      .then(content => {
        t.equal(content, 'test in dir1', 'has same content');
        t.end();
      })
      .catch(t.end);
  });

  test('symlink dest that doesnt exist yet', t => {
    symlink(dest2, filepath2)
      .then(() => {
        t.pass('symlink created');
        t.true(lstatSync(filepath2).isSymbolicLink(), 'is symbolic link');
        return readFile(filepath2);
      })
      .catch(() => {
        t.pass('no file there yet');
        return writeFile(dest2, 'text after symlink\n');
      })
      .then(() => readFile(filepath2, { encoding: 'utf8' }))
      .then(content => {
        t.equal(
          content,
          'text after symlink\n',
          'symlink has content of dest2'
        );
        t.end();
      })
      .catch(t.end);
  });

  test('symlink error', t => {
    symlink(dest1, filepath1)
      .then(() => {
        t.fail('should not symlink');
        t.end();
      })
      .catch(error => {
        t.true(error instanceof Error, 'instance of Error');
        t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
        t.equal(error.syscall, 'symlink', 'error.syscal is symlink');
        t.equal(error.path, dest1, 'correct error.path');
        t.true(error.message.includes(dest1), 'message includes path1');
        t.true(error.message.includes(filepath1), 'message includes path2');
        t.true(
          error.message.includes('file already exists'),
          'includes file already exists message'
        );
        t.end();
      });
  });
}
