var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;

var file1 = resolve(__dirname, './data/writefile-1.txt');
var file2 = resolve(__dirname, './data/writefile-2.json');
var file3 = resolve(__dirname, './data/writefile-3.txt');
var file4 = resolve(__dirname, './data/writefile/new/file.txt');

tape('writeFile', (t) => {
  file
    .writeFile(file1, 'Hello File!')
    .then(() => {
      t.pass('file written');
      t.equal(readFileSync(file1, 'utf8'), 'Hello File!');
      t.end();
    })
    .catch((error) => {
      t.error(error);
      t.end();
    });
});

tape('writeFile JSON', (t) => {
  file
    .writeFile(file2, { data: 1 })
    .then(() => {
      t.pass('JSON written');
      t.equal(readFileSync(file2, 'utf8'), '{"data":1}');
      t.end();
    })
    .catch((error) => {
      t.error(error);
      t.end();
    });
});

tape('writeFile Buffer', (t) => {
  file
    .writeFile(file3, new Buffer("I'm a buffer"))
    .then(() => {
      t.pass('Buffer written');
      t.equal(readFileSync(file3, 'utf8'), "I'm a buffer");
      t.end();
    })
    .catch((error) => {
      t.error(error);
      t.end();
    });
});

tape('writeFile to a new directory', (t) => {
  file
    .writeFile(file4, 'In a new directory')
    .then(() => {
      t.pass('file written');
      t.equal(readFileSync(file4, 'utf8'), 'In a new directory');
      t.end();
    })
    .catch((error) => {
      t.error(error);
      t.end();
    });
});

tape('writeFile error', (t) => {
  file
    .writeFile()
    .then(() => {
      t.fail('should not write');
      t.end();
    })
    .catch((error) => {
      t.ok(error, error);
      t.ok(error instanceof TypeError, 'is TypeError');
      t.end();
    });
});

tape('writeFile on a dir error', (t) => {
  var dir = resolve(__dirname, './data/writefile/new');
  file
    .writeFile(dir, 'here is a dir')
    .then(() => {
      t.fail('should not write');
      t.end();
    })
    .catch((error) => {
      t.ok(error, error);
      t.ok(error instanceof Error, 'is Error');
      t.equal(error.code, 'EISDIR', 'error.code is EISDIR');
      t.end();
    });
});
