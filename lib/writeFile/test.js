const { resolve } = require('path');
const test = require('tape');
const { open, close, readFile, writeFile } = require('../../');

const dir = resolve(process.cwd(), './test/data/');
const file1 = resolve(dir, './writefile-1.txt');
const file2 = resolve(dir, './writefile-2.json');
const file3 = resolve(dir, './writefile-3.txt');
const file4 = resolve(dir, './writefile/new/file.txt');

test('writeFile', t => {
  writeFile(file1, 'Hello File!')
    .then(() => readFile(file1, 'utf8'))
    .then(content => {
      t.equal(content, 'Hello File!', 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('writeFile JSON', t => {
  writeFile(file2, { data: 1 })
    .then(() => readFile(file2, 'utf8'))
    .then(content => {
      t.equal(content, '{"data":1}', 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('writeFile Buffer', t => {
  writeFile(file3, Buffer.from("I'm a buffer"))
    .then(() => readFile(file3, 'utf8'))
    .then(content => {
      t.equal(content, "I'm a buffer", 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('writeFile to a new directory', t => {
  writeFile(file4, 'In a new directory')
    .then(() => readFile(file4, 'utf8'))
    .then(content => {
      t.equal(content, 'In a new directory', 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('readFile to fd', t => {
  open(file4, {
    flags: 'r+'
  })
    .then(fd => {
      return writeFile(fd, '_ an old')
        .then(() => readFile(file4, 'utf8'))
        .then(content => {
          t.equal(content, '_ an old directory', 'correct content');
          return close(fd);
        })
        .then(t.end);
    })
    .catch(t.end);
});

test('writeFile error', t => {
  writeFile()
    .then(() => {
      t.fail('should not write');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof TypeError, 'is TypeError');
      t.true(
        error.message.includes('path must be a string or Buffer'),
        'includes path must be a string or Buffer message'
      );
      t.end();
    });
});

test('writeFile on a dir error', t => {
  const newdir = resolve(dir, './writefile/new');

  writeFile(newdir, 'here is a dir')
    .then(() => {
      t.fail('should not write');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'is Error');
      t.equal(error.code, 'EISDIR', 'error.code is EISDIR');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.equal(error.path, newdir, 'correct error.path');
      t.true(
        error.message.includes('illegal operation on a directory'),
        'includes illegal operation on a directory message'
      );
      t.end();
    });
});
