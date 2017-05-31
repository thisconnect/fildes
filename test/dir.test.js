const file = require('../');

const test = require('tape');
const resolve = require('path').resolve;
const writeFileSync = require('fs').writeFileSync;

const dirpath1 = resolve(__dirname, './data/dir/dir/sub/subsub');
const filepath = resolve(__dirname, './data/dir.txt');

test('setup dirs', t => {
  writeFileSync(filepath, 'chmod test\n');
  t.end();
});

test('mkdir', t => {
  file
    .mkdir(dirpath1)
    .then(() => {
      t.pass('dir created');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('mkdir on file', t => {
  file
    .mkdir(filepath)
    .then(() => {
      t.fail('dir created');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EEXIST', 'error.code is EEXIST');
      t.equal(error.syscall, 'mkdir', 'error.syscall is mkdir');
      t.end();
    });
});

test('mkdir error', t => {
  file
    .mkdir(-1)
    .then(() => {
      t.fail('should not create dir');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.ok(error instanceof TypeError, 'is TypeError');
      t.end();
    });
});

test('readdir', t => {
  const dir = resolve(__dirname, './data/dir');

  file
    .readdir(dir)
    .then(files => {
      t.ok(files, 'has files');
      t.ok(Array.isArray(files), 'files is Array');
      t.ok(files.length > 1, 'has some files');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('readdir error', t => {
  const dir = resolve(__dirname, './data/dir/that/is/not/here');

  file
    .readdir(dir)
    .then(() => {
      t.fail('should read directory that is not there');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.end();
    });
});
