const { resolve } = require('path');
const test = require('tape');
const { write, read, open, close } = require('../../');

const dir = resolve(process.cwd(), './test/data/');
const filepath1 = resolve(dir, './read.txt');
const filepath2 = resolve(dir, './read-foo-bar.txt');

test('setup read', t => {
  Promise.all([write(filepath1, 'Hi!!!\n'), write(filepath2, 'foo bar bOz\n')])
    .then(() => t.end())
    .catch(t.end);
});

test('read', t => {
  read(filepath1, {
    length: 4
  })
    .then(buffer => {
      t.deepEqual(buffer, Buffer.from('Hi!!'));
      t.end();
    })
    .catch(t.end);
});

test('read to buffer', t => {
  const buffer = Buffer.alloc(3);
  read(filepath1, buffer, {
    offset: 0,
    length: 3
  })
    .then(() => {
      t.equal(buffer.toString(), 'Hi!', 'contains Hi!');
      t.end();
    })
    .catch(t.end);
});

test('read partly', t => {
  read(filepath2, {
    length: 3,
    position: 8,
    encoding: 'utf8'
  })
    .then(data => {
      t.equal(data, 'bOz', 'got bOz');
      t.end();
    })
    .catch(t.end);
});

test('read too much', t => {
  read(filepath2, {
    length: 128
  })
    .then(buffer => {
      t.equal(buffer.length, 'foo bar bOz\n'.length, 'length is correct');
      t.equal(buffer.toString(), 'foo bar bOz\n', 'got correct content');
      t.end();
    })
    .catch(t.end);
});

test('read many', t => {
  Promise.all(
    [filepath1, filepath2].map(path => {
      return read(path, {
        length: 4,
        position: 1,
        encoding: 'utf8'
      });
    })
  )
    .then(result => {
      t.equal(result[0], 'i!!!', 'got part of file1');
      t.equal(result[1], 'oo b', 'got part of file2');
      t.end();
    })
    .catch(t.end);
});

test('read partly to buffer', t => {
  const buffer = Buffer.alloc(3);

  read(filepath2, buffer, {
    flags: 'r',
    offset: 0,
    length: 3,
    position: 8
  })
    .then(() => {
      t.equal(buffer.toString(), 'bOz', 'got bOz');
      t.end();
    })
    .catch(t.end);
});

test('read path error', t => {
  read(filepath2)
    .then(() => {
      t.fail('should have no data');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof TypeError, 'is TypeError');
      t.true(
        error.message.includes('length is required'),
        'includes length is required message'
      );
      t.end();
    });
});

test('read from fd', t => {
  open(filepath1, {
    flags: 'r'
  })
    .then(fd => {
      return read(fd, {
        length: 3
      })
        .then(result => {
          t.equal(result.toString(), 'Hi!', 'got Hi!');
          return close(fd);
        })
        .then(t.end);
    })
    .catch(t.end);
});

test('read fd error', t => {
  read(-1, Buffer.alloc(3), {
    offset: 0,
    length: 3
  })
    .then(() => {
      t.fail('should have no data');
      t.end();
    })
    .catch(error => {
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'read', 'error.syscall is read');
      t.true(
        error.message.includes('bad file descriptor'),
        'includes bad file descriptor message'
      );
      t.end();
    });
});
