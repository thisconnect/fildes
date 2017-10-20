const { resolve } = require('path');
const { statSync } = require('fs');
const test = require('tape');
const { chown, write } = require('../../');

const filepath = resolve(process.cwd(), './test/data/chown.txt');

if (process.platform != 'win32') {
  test('setup chown', t => {
    write(filepath, 'chown test\n')
      .then(() => t.end())
      .catch(t.end);
  });

  test('chown', t => {
    chown(filepath)
      .then(() => {
        const stats = statSync(filepath);
        t.equal(stats.uid, process.getuid(), 'uid is process.getuid');
        t.equal(stats.gid, process.getgid(), 'gid is process.getgid');
        t.end();
      })
      .catch(t.end);
  });

  test('chown error', t => {
    chown(-1)
      .then(() => {
        t.fail('should not chown');
        t.end();
      })
      .catch(error => {
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'fchown', 'error.syscal is fchown');
        t.end();
      });
  });
}
