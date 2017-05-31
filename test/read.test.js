const file = require('../');

const tape = require('tape');
const resolve = require('path').resolve;
const writeFileSync = require('fs').writeFileSync;

const filepath1 = resolve(__dirname, './data/read.txt');
const filepath2 = resolve(__dirname, './data/read-foo-bar.txt');

tape('setup read', t => {
  writeFileSync(filepath1, 'Hi!!!\n');
  writeFileSync(filepath2, 'foo bar bOz\n');
  t.end();
});

tape('read', t => {
  file
    .read(filepath1, {
      length: 4
    })
    .then(buffer => {
      t.deepEqual(buffer, new Buffer('Hi!!'));
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('read to buffer', t => {
  const buffer = new Buffer(3);
  file
    .read(filepath1, buffer, {
      offset: 0,
      length: 3
    })
    .then(() => {
      t.equal(buffer.toString(), 'Hi!');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('read partly', t => {
  file
    .read(filepath2, {
      length: 3,
      position: 8,
      encoding: 'utf8'
    })
    .then(buffer => {
      t.equal(buffer, 'bOz');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('read too much', t => {
  file
    .read(filepath2, {
      length: 128
    })
    .then(buffer => {
      t.ok(buffer.length == 'foo bar bOz\n'.length, 'length is correct');
      t.equal(buffer.toString(), 'foo bar bOz\n');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('read many', t => {
  Promise.all(
    [filepath1, filepath2].map(path => {
      return file.read(path, {
        length: 4,
        position: 1,
        encoding: 'utf8'
      });
    })
  )
    .then(result => {
      t.equal(result[0], 'i!!!');
      t.equal(result[1], 'oo b');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('read partly to buffer', t => {
  const buffer = new Buffer(3);

  file
    .read(filepath2, buffer, {
      flags: 'r',
      offset: 0,
      length: 3,
      position: 8
    })
    .then(() => {
      t.equal(buffer.toString(), 'bOz');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('read path error', t => {
  file
    .read(filepath2)
    .then(() => {
      t.fail('should have no data');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.ok(error instanceof TypeError, 'is TypeError');
      t.end();
    });
});

tape('read fd error', t => {
  file
    .read(-1, new Buffer(3), {
      offset: 0,
      length: 3
    })
    .then(() => {
      t.fail('should have no data');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'read', 'error.syscall is read');
      t.end();
    });
});
