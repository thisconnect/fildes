const file = require('../');

const test = require('tape');
const { resolve } = require('path');
const { writeFileSync } = require('fs');

const filepath1 = resolve(__dirname, './data/stats.txt');
const filepath2 = resolve(__dirname, './data/stats2.txt');
const filepath3 = resolve(__dirname, './data/stats3.txt');

test('setup stats', t => {
  writeFileSync(filepath1, 'Hi\n');
  writeFileSync(filepath2, 'Hi\n');
  writeFileSync(filepath3, 'Hi\n');
  t.end();
});

test('stats', t => {
  file
    .stats(filepath1)
    .then(stats => {
      t.equal(stats.size, 3, 'stats.size is 3');
      t.pass('stats received');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('get size of many files', t => {
  const getSizes = [filepath1, filepath2, filepath3].map(filepath => {
    return file.stats(filepath).then(stat => stat.size);
  });

  Promise.all(getSizes)
    .then(sizes => {
      t.equal(sizes.length, 3, 'stats.length is 3');
      t.true(sizes.every(size => size > 1), 'each gt 1');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('stats non-existing file', t => {
  const path = resolve(__dirname, './data/nothing-here.txt');

  file
    .stats(path)
    .then(() => {
      t.fail('should have no stats');
      t.end();
    })
    .catch(error => {
      t.true(error, error);
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.equal(error.path, path);
      t.end();
    });
});

test('check if many files exist', t => {
  const files = [filepath1, 'nothere.txt', 'dir'];

  function isFile(filename) {
    const filepath = resolve(__dirname, 'data', filename);
    return file.stats(filepath).then(stat => stat.isFile()).catch(() => false);
  }

  Promise.all(files.map(isFile))
    .then(exist => {
      t.equal(exist.length, 3, 'stats.length is 3');
      t.deepEqual(exist, [true, false, false]);
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('stats wrong fd', t => {
  file
    .stats(-1)
    .then(() => {
      t.fail('should have no stats');
      t.end();
    })
    .catch(error => {
      t.true(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'fstat', 'error.syscall is fstat');
      t.end();
    });
});
