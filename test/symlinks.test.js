var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var lstatSync = require('fs').lstatSync;
var writeFileSync = require('fs').writeFileSync;

var dest1 = resolve(__dirname, './data/symlink.txt');
var dest2 = resolve(__dirname, './data/symlink/dest.txt');
var filepath1 = resolve(__dirname, './data/symlink/symlink.txt');
var filepath2 = resolve(__dirname, './data/symlink/symlink2.txt');
var dir1 = resolve(__dirname, './data/symlink/dir1');
var dir2 = resolve(__dirname, './data/symlink/dir2');

// Exclude symlink tests for now
// test pass with administrators permisison
if (process.platform != 'win32') {
  tape('setup symlink', (t) => {
    writeFileSync(dest1, 'symlink test\n');
    t.end();
  });

  tape('symlink', (t) => {
    file
      .symlink(dest1, filepath1)
      .then(() => {
        t.pass('file symlinked');
        return file.readFile(filepath1, { encoding: 'utf8' });
      })
      .then((content) => {
        t.equal(content, 'symlink test\n', 'symlink has content of dest1');
        t.end();
      })
      .catch((error) => {
        t.error(error);
        t.end();
      });
  });

  tape('symlink dir', (t) => {
    var file1 = resolve(dir1, 'file.txt');
    var file2 = resolve(dir2, 'file.txt');

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
      .then((files) => {
        t.ok(Array.isArray(files), 'files is Array');
        t.ok(files.length == 1, 'has some files');
        t.equal(files[0], 'file.txt', 'dir 2 has file.txt');
        return file.readFile(file2, { encoding: 'utf8' });
      })
      .then((content) => {
        t.equal(content, 'test in dir1', 'has same content');
        t.end();
      })
      .catch((error) => {
        t.error(error);
        t.end();
      });
  });

  tape('symlink dest that doesnt exist yet', (t) => {
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
      .then((content) => {
        t.equal(
          content,
          'text after symlink\n',
          'symlink has content of dest2'
        );
        t.end();
      })
      .catch((error) => {
        t.error(error);
        t.end();
      });
  });

  tape('symlink error', (t) => {
    file
      .symlink(dest1, filepath1)
      .then(() => {
        t.fail('should not symlink');
        t.end();
      })
      .catch((error) => {
        t.ok(error, error);
        t.ok(error instanceof Error, 'instance of Error');
        t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
        t.equal(error.syscall, 'symlink', 'error.syscal is symlink');
        t.end();
      });
  });
}
