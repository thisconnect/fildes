const { resolve } = require('path');
const { statSync } = require('fs');
const test = require('tape');
const { chmod, write } = require('../../');

const filepath = resolve(process.cwd(), './test/data/chmod.txt');

function isPermission(mode, permission) {
  mode = '0' + (mode & parseInt('0777', 8)).toString(8);
  return mode === permission;
}

if (process.platform != 'win32') {
  test('setup chmod', t => {
    write(filepath, 'chmod test\n')
      .then(() => t.end())
      .catch(t.end);
  });

  test('chmod', t => {
    chmod(filepath, {
      mode: '0700' // nobody else
    })
      .then(() => {
        const stats = statSync(filepath);
        t.true(isPermission(stats.mode, '0700'), 'permission set to 0700');

        return chmod(filepath, {
          mode: parseInt('0755', 8)
        });
      })
      .then(() => {
        const stats = statSync(filepath);
        t.true(isPermission(stats.mode, '0755'), 'permission set to 0755');
        t.end();
      })
      .catch(t.end);
  });

  test('chmod error', t => {
    chmod(-1, {
      mode: '0777'
    })
      .then(() => {
        t.fail('should not chmod');
        t.end();
      })
      .catch(error => {
        t.true(error instanceof Error, 'is Error');
        t.true(
          /^(ERR_OUT_OF_RANGE|EBADF)$/.test(error.code),
          'error.code is ERR_OUT_OF_RANGE (or EBADF on node < 10)'
        );
        t.end();
      });
  });

  test('chmod error 2', t => {
    chmod(filepath)
      .then(() => {
        t.fail('should not chmod');
        t.end();
      })
      .catch(error => {
        t.true(error instanceof TypeError, 'is TypeError');
        t.end();
      });
  });
}
