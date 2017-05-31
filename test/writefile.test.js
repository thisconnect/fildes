const file = require('../');

const test = require('tape');
const resolve = require('path').resolve;
const readFileSync = require('fs').readFileSync;

const file1 = resolve(__dirname, './data/writefile-1.txt');
const file2 = resolve(__dirname, './data/writefile-2.json');
const file3 = resolve(__dirname, './data/writefile-3.txt');
const file4 = resolve(__dirname, './data/writefile/new/file.txt');

test('writeFile', t => {
  file
    .writeFile(file1, 'Hello File!')
    .then(() => {
      t.pass('file written');
      t.equal(readFileSync(file1, 'utf8'), 'Hello File!');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('writeFile JSON', t => {
  file
    .writeFile(file2, { data: 1 })
    .then(() => {
      t.pass('JSON written');
      t.equal(readFileSync(file2, 'utf8'), '{"data":1}');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('writeFile Buffer', t => {
  file
    .writeFile(file3, new Buffer("I'm a buffer"))
    .then(() => {
      t.pass('Buffer written');
      t.equal(readFileSync(file3, 'utf8'), "I'm a buffer");
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('writeFile to a new directory', t => {
  file
    .writeFile(file4, 'In a new directory')
    .then(() => {
      t.pass('file written');
      t.equal(readFileSync(file4, 'utf8'), 'In a new directory');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

test('writeFile error', t => {
  file
    .writeFile()
    .then(() => {
      t.fail('should not write');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.ok(error instanceof TypeError, 'is TypeError');
      t.end();
    });
});

test('writeFile on a dir error', t => {
  const dir = resolve(__dirname, './data/writefile/new');
  file
    .writeFile(dir, 'here is a dir')
    .then(() => {
      t.fail('should not write');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.ok(error instanceof Error, 'is Error');
      t.equal(error.code, 'EISDIR', 'error.code is EISDIR');
      t.end();
    });
});
