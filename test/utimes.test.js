const file = require('../');

const test = require('tape');
const { resolve } = require('path');
const { statSync } = require('fs');
const { writeFileSync } = require('fs');

const filepath1 = resolve(__dirname, './data/utimes.txt');

test('setup utimes', t => {
  writeFileSync(filepath1, 'file content\n');
  t.end();
});

test('utimes', t => {
  const now = Date.now();
  const firstoct = new Date('2015-10-01');

  file
    .utimes(filepath1, {
      access: now / 1000 - 2, // two seconds ago
      modification: firstoct
    })
    .then(() => {
      const stats = statSync(filepath1);
      t.ok(stats.atime instanceof Date, 'atime instanceof Date');
      t.ok(stats.mtime instanceof Date, 'mtime instanceof Date');
      t.ok(
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
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('utimes defaults to now', t => {
  const before = new Date(Date.now() - 1000);

  file
    .utimes(filepath1)
    .then(() => {
      const stats = statSync(filepath1);
      t.ok(stats.atime >= before, 'access before');
      t.ok(stats.mtime >= before, 'modification before');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('utimes error', t => {
  file
    .utimes(filepath1, {
      access: '2015-10-01',
      modification: '2015-10-01'
    })
    .then(() => {
      t.fail('should not futimes');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.end();
    });
});

test('utimes fd error', t => {
  file
    .utimes(-1)
    .then(() => {
      t.fail('should not futimes');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'futime', 'error.syscall is futime');
      t.end();
    });
});
