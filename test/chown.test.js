const file = require('../');

const test = require('tape');
const resolve = require('path').resolve;
const statSync = require('fs').statSync;
const writeFileSync = require('fs').writeFileSync;

const filepath = resolve(__dirname, './data/chown.txt');

if (process.platform != 'win32') {
  test('setup chown', t => {
    writeFileSync(filepath, 'chown test\n');
    t.end();
  });

  test('chown', t => {
    file
      .chown(filepath)
      .then(() => {
        const stats = statSync(filepath);

        t.equal(stats.uid, process.getuid(), 'uid is process.getuid');
        t.equal(stats.gid, process.getgid(), 'gid is process.getgid');
        t.end();
      })
      .catch(error => {
        t.error(error);
        t.end();
      });
  });

  test('chown error', t => {
    file
      .chown(-1)
      .then(() => {
        t.fail('should not chown');
        t.end();
      })
      .catch(error => {
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'fchown', 'error.syscal is fchown');
        t.end();
      });
  });
}
