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
        t.true(
          /^(ERR_OUT_OF_RANGE|EBADF)$/.test(error.code),
          'error.code is ERR_OUT_OF_RANGE (or EBADF on node < 10)'
        );
        t.end();
      });
  });
}
