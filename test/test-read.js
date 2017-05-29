var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var writeFileSync = require('fs').writeFileSync;

var filepath1 = resolve(__dirname, './data/read.txt');
var filepath2 = resolve(__dirname, './data/read-foo-bar.txt');

tape('setup read', function(t) {
  writeFileSync(filepath1, 'Hi!!!\n');
  writeFileSync(filepath2, 'foo bar bOz\n');
  t.end();
});

tape('read', function(t) {
  file
    .read(filepath1, {
      length: 4
    })
    .then(function(buffer) {
      t.deepEqual(buffer, new Buffer('Hi!!'));
      t.end();
    })
    .catch(function(error) {
      t.error(error);
      t.end();
    });
});

tape('read to buffer', function(t) {
  var buffer = new Buffer(3);
  file
    .read(filepath1, buffer, {
      offset: 0,
      length: 3
    })
    .then(function() {
      t.equal(buffer.toString(), 'Hi!');
      t.end();
    })
    .catch(function(error) {
      t.error(error);
      t.end();
    });
});

tape('read partly', function(t) {
  file
    .read(filepath2, {
      length: 3,
      position: 8,
      encoding: 'utf8'
    })
    .then(function(buffer) {
      t.equal(buffer, 'bOz');
      t.end();
    })
    .catch(function(error) {
      t.error(error);
      t.end();
    });
});

tape('read too much', function(t) {
  file
    .read(filepath2, {
      length: 128
    })
    .then(function(buffer) {
      t.ok(buffer.length == 'foo bar bOz\n'.length, 'length is correct');
      t.equal(buffer.toString(), 'foo bar bOz\n');
      t.end();
    })
    .catch(function(error) {
      t.error(error);
      t.end();
    });
});

tape('read many', function(t) {
  Promise.all(
    [filepath1, filepath2].map(function(path) {
      return file.read(path, {
        length: 4,
        position: 1,
        encoding: 'utf8'
      });
    })
  )
    .then(function(result) {
      t.equal(result[0], 'i!!!');
      t.equal(result[1], 'oo b');
      t.end();
    })
    .catch(function(error) {
      t.error(error);
      t.end();
    });
});

tape('read partly to buffer', function(t) {
  var buffer = new Buffer(3);

  file
    .read(filepath2, buffer, {
      flags: 'r',
      offset: 0,
      length: 3,
      position: 8
    })
    .then(function() {
      t.equal(buffer.toString(), 'bOz');
      t.end();
    })
    .catch(function(error) {
      t.error(error);
      t.end();
    });
});

tape('read path error', function(t) {
  file
    .read(filepath2)
    .then(function(data) {
      t.fail('should have no data');
      t.end();
    })
    .catch(function(error) {
      t.ok(error, error);
      t.ok(error instanceof TypeError, 'is TypeError');
      t.end();
    });
});

tape('read fd error', function(t) {
  file
    .read(-1, new Buffer(3), {
      offset: 0,
      length: 3
    })
    .then(function(data) {
      t.fail('should have no data');
      t.end();
    })
    .catch(function(error) {
      t.ok(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'read', 'error.syscall is read');
      t.end();
    });
});
