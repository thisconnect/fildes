const file = require('../');

const test = require('tape');
const resolve = require('path').resolve;
const statSync = require('fs').statSync;
const writeFileSync = require('fs').writeFileSync;

const filepath = resolve(__dirname, './data/chmod.txt');

function isPermission(mode, permission) {
  mode = '0' + (mode & parseInt('0777', 8)).toString(8);
  return mode === permission;
}

if (process.platform != 'win32') {
  test('setup chmod', t => {
    writeFileSync(filepath, 'chmod test\n');
    t.end();
  });

  test('chmod', t => {
    file
      .chmod(filepath, {
        mode: '0700' // nobody else
      })
      .then(() => {
        const stats = statSync(filepath);
        t.ok(isPermission(stats.mode, '0700'), 'permission set to 0700');

        return file.chmod(filepath, {
          mode: parseInt('0755', 8)
        });
      })
      .then(() => {
        const stats = statSync(filepath);
        t.ok(isPermission(stats.mode, '0755'), 'permission set to 0755');
        t.end();
      })
      .catch(error => {
        t.error(error);
        t.end();
      });
  });

  test('chmod error', t => {
    file
      .chmod(-1, {
        mode: '0777'
      })
      .then(() => {
        t.fail('should not chmod');
        t.end();
      })
      .catch(error => {
        t.ok(error, error);
        t.equal(error.code, 'EBADF', 'error.code is EBADF');
        t.equal(error.syscall, 'fchmod', 'error.syscal is fchmod');
        t.end();
      });
  });

  test('chmod error 2', t => {
    file
      .chmod(filepath)
      .then(() => {
        t.fail('should not chmod');
        t.end();
      })
      .catch(error => {
        t.ok(error, error);
        t.ok(error instanceof TypeError, 'is TypeError');
        t.end();
      });
  });
}
