/* prettier-ignore-function: matrix, matrix2d, etc */

const { resolve } = require('path');
const test = require('tape');
const { statSync } = require('fs');
const { utimes, write } = require('../../');

const filepath1 = resolve(process.cwd(), './test/data/utimes.txt');

test('setup utimes', t => {
  write(filepath1, 'file content\n')
    .then(() => t.end())
    .catch(t.end);
});

test('utimes', t => {
  const now = Date.now();
  const firstoct = new Date('2015-10-01');

  utimes(filepath1, {
    // eslint-disable-next-line
    access: now / 1000 - 2, // two seconds ago
    modification: firstoct
  })
    .then(() => {
      const stats = statSync(filepath1);
      t.true(stats.atime instanceof Date, 'atime instanceof Date');
      t.true(stats.mtime instanceof Date, 'mtime instanceof Date');
      t.true(
        stats.atime.getTime() > new Date(now - 3000).getTime(),
        'access was 2 seconds ago'
      );
      t.equal(
        stats.mtime.getTime(),
        firstoct.getTime(),
        'modification was on 2015-10-01'
      );
      t.end();
    })
    .catch(t.end);
});

test('utimes defaults to now', t => {
  const before = new Date(Date.now() - 1000);

  utimes(filepath1)
    .then(() => {
      const stats = statSync(filepath1);
      t.true(stats.atime >= before, 'access before');
      t.true(stats.mtime >= before, 'modification before');
      t.end();
    })
    .catch(t.end);
});

test('utimes error', t => {
  utimes(filepath1, {
    access: '2015-10-01',
    modification: '2015-10-01'
  })
    .then(() => {
      t.fail('should not futimes');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'instance of Error');
      t.end();
    });
});

test('utimes fd error', t => {
  utimes(-1)
    .then(() => {
      t.fail('should not futimes');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'instance of Error');
      t.true(
        /^(ERR_OUT_OF_RANGE|EBADF)$/.test(error.code),
        'error.code is ERR_OUT_OF_RANGE (or EBADF on node < 10)'
      );
      t.end();
    });
});
