const file = require('../');

const test = require('tape');
const { resolve } = require('path');
const lstatSync = require('fs').lstatSync;
const { writeFileSync } = require('fs');

const dest1 = resolve(__dirname, './data/symlink.txt');
const dest2 = resolve(__dirname, './data/symlink/dest.txt');
const filepath1 = resolve(__dirname, './data/symlink/symlink.txt');
const filepath2 = resolve(__dirname, './data/symlink/symlink2.txt');
const dir1 = resolve(__dirname, './data/symlink/dir1');
const dir2 = resolve(__dirname, './data/symlink/dir2');

// Exclude symlink tests for now
// test pass with administrators permisison
if (process.platform != 'win32') {
  test('setup symlink', t => {
    writeFileSync(dest1, 'symlink test\n');
    t.end();
  });

  test('symlink', t => {
    file
      .symlink(dest1, filepath1)
      .then(() => {
        t.pass('file symlinked');
        return file.readFile(filepath1, { encoding: 'utf8' });
      })
      .then(content => {
        t.equal(content, 'symlink test\n', 'symlink has content of dest1');
        t.end();
      })
      .catch(error => {
        t.error(error);
        t.end();
      });
  });

  test('symlink dir', t => {
    const file1 = resolve(dir1, 'file.txt');
    const file2 = resolve(dir2, 'file.txt');

    file
      .mkdir(dir1)
      .then(() => {
        return file.symlink(dir1, dir2);
      })
      .then(() => {
        return file.writeFile(file1, 'test in dir1');
      })
      .then(() => {
        t.pass('dir symlinked');
        return file.readdir(dir2);
      })
      .then(files => {
        t.ok(Array.isArray(files), 'files is Array');
        t.ok(files.length == 1, 'has some files');
        t.equal(files[0], 'file.txt', 'dir 2 has file.txt');
        return file.readFile(file2, { encoding: 'utf8' });
      })
      .then(content => {
        t.equal(content, 'test in dir1', 'has same content');
        t.end();
      })
      .catch(error => {
        t.error(error);
        t.end();
      });
  });

  test('symlink dest that doesnt exist yet', t => {
    file
      .symlink(dest2, filepath2)
      .then(() => {
        t.pass('symlink created');
        t.ok(lstatSync(filepath2).isSymbolicLink(), 'is symbolic link');
        return file.readFile(filepath2);
      })
      .catch(() => {
        t.pass('no file there yet');
        return file.writeFile(dest2, 'text after symlink\n');
      })
      .then(() => {
        return file.readFile(filepath2, { encoding: 'utf8' });
      })
      .then(content => {
        t.equal(
          content,
          'text after symlink\n',
          'symlink has content of dest2'
        );
        t.end();
      })
      .catch(error => {
        t.error(error);
        t.end();
      });
  });

  test('symlink error', t => {
    file
      .symlink(dest1, filepath1)
      .then(() => {
        t.fail('should not symlink');
        t.end();
      })
      .catch(error => {
        t.ok(error, error);
        t.ok(error instanceof Error, 'instance of Error');
        t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
        t.equal(error.syscall, 'symlink', 'error.syscal is symlink');
        t.end();
      });
  });
}
