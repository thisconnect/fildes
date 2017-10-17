const { resolve } = require('path');
const test = require('tape');
const { stats, write } = require('../../');

const dir = resolve(process.cwd(), './test/data/');
const filepath1 = resolve(dir, './stats.txt');
const filepath2 = resolve(dir, './stats2.txt');
const filepath3 = resolve(dir, './stats3.txt');

test('setup stats', t => {
  Promise.all([
    write(filepath1, 'Hi\n'),
    write(filepath2, 'Hi\n'),
    write(filepath3, 'Hi\n')
  ])
    .then(() => t.end())
    .catch(t.end);
});

test('stats', t => {
  stats(filepath1)
    .then(stats => {
      t.equal(stats.size, 3, 'stats.size is 3');
      t.pass('stats received');
      t.end();
    })
    .catch(t.end);
});

test('get size of many files', t => {
  const getSizes = [filepath1, filepath2, filepath3].map(filepath => {
    return stats(filepath).then(stat => stat.size);
  });

  Promise.all(getSizes)
    .then(sizes => {
      t.equal(sizes.length, 3, 'stats.length is 3');
      t.true(sizes.every(size => size > 1), 'each gt 1');
      t.end();
    })
    .catch(t.end);
});

test('check if many files exist', t => {
  const files = [filepath1, 'nothere.txt', 'dir'];

  function isFile(filename) {
    const filepath = resolve(dir, filename);
    return stats(filepath)
      .then(stat => stat.isFile())
      .catch(() => false);
  }

  Promise.all(files.map(isFile))
    .then(exist => {
      t.equal(exist.length, 3, 'stats.length is 3');
      t.deepEqual(exist, [true, false, false]);
      t.end();
    })
    .catch(t.end);
});

test('stats non-existing file', t => {
  const path = resolve(dir, './nothing-here.txt');

  stats(path)
    .then(() => {
      t.fail('should have no stats');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.equal(error.path, path, 'correct error.path');
      t.true(
        error.message.includes('no such file or directory'),
        'includes no such file or directory message'
      );
      t.end();
    });
});

test('stats wrong fd', t => {
  stats(-1)
    .then(() => {
      t.fail('should have no stats');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'fstat', 'error.syscall is fstat');
      t.true(
        error.message.includes('bad file descriptor'),
        'includes bad file descriptor message'
      );
      t.end();
    });
});
