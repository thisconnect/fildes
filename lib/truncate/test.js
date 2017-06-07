const { resolve } = require('path');
const test = require('tape');
const { truncate, open, write, close, readFile } = require('../../');

const filepath1 = resolve(process.cwd(), './test/data/truncate.txt');

test('setup truncate', t => {
  write(filepath1, 'abcdefghijklmnopqrstuvwxyz\n')
    .then(() => t.end())
    .catch(t.end);
});

test('truncate', t => {
  truncate(filepath1, {
    length: 9
  })
    .then(() => readFile(filepath1, 'utf8'))
    .then(content => {
      t.equal(content.length, 9, 'content.length is 9');
      t.equal(content, 'abcdefghi', 'content is abcdefghi');
      t.end();
    })
    .catch(t.end);
});

test('truncate with fd', t => {
  open(filepath1, {
    flags: 'r+'
  })
    .then(fd => {
      return truncate(fd, {
        length: 8
      })
        .then(() => readFile(fd, 'utf8'))
        .then(content => {
          t.equal(content.length, 8, 'content.length is 8');
          t.equal(content, 'abcdefgh', 'content is abdefgh');
          return close(fd);
        })
        .then(t.end);
    })
    .catch(t.end);
});

test('truncate all', t => {
  truncate(filepath1)
    .then(() => readFile(filepath1, 'utf8'))
    .then(content => {
      t.equal(content.length, 0, 'content.length is 0');
      t.equal(content, '', 'content is an empty string');
      t.end();
    })
    .catch(t.end);
});

test('truncate error', t => {
  truncate(filepath1, {
    length: -1
  })
    .then(() => {
      t.fail('should not truncate');
      t.end();
    })
    .catch(error => {
      t.true(error instanceof Error, 'instance of Error');
      t.equal(error.code, 'EINVAL', 'error.code is EINVAL');
      t.equal(error.syscall, 'ftruncate', 'error.syscall is ftruncate');
      t.true(
        error.message.includes('invalid argument'),
        'includes invalid argument message'
      );
      t.end();
    });
});
