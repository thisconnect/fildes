var file = require('../');

var tape = require('tape');
var resolve = require('path').resolve;
var writeFileSync = require('fs').writeFileSync;

var filepath1 = resolve(__dirname, './data/stats.txt');
var filepath2 = resolve(__dirname, './data/stats2.txt');
var filepath3 = resolve(__dirname, './data/stats3.txt');

tape('setup stats', t => {
  writeFileSync(filepath1, 'Hi\n');
  writeFileSync(filepath2, 'Hi\n');
  writeFileSync(filepath3, 'Hi\n');
  t.end();
});

tape('stats', t => {
  file
    .stats(filepath1)
    .then(stats => {
      t.equal(stats.size, 3, 'stats.size is 3');
      t.pass('stats received');
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('get size of many files', t => {
  var getSizes = [filepath1, filepath2, filepath3].map(filepath => {
    return file.fstat(filepath).then(stat => {
      return stat.size;
    });
  });

  Promise.all(getSizes)
    .then(sizes => {
      t.equal(sizes.length, 3, 'stats.length is 3');
      t.ok(
        sizes.every(size => {
          return size > 1;
        }),
        'each gt 1'
      );
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('stats non-existing file', t => {
  var path = resolve(__dirname, './data/nothing-here.txt');

  file
    .fstat(path)
    .then(stats => {
      t.fail('should have no stats');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'ENOENT', 'error.code is ENOENT');
      t.equal(error.syscall, 'open', 'error.syscall is open');
      t.equal(error.path, path);
      t.end();
    });
});

tape('check if many files exist', t => {
  var files = [filepath1, 'nothere.txt', 'dir'];

  function isFile(filename) {
    var filepath = resolve(__dirname, 'data', filename);
    return file
      .fstat(filepath)
      .then(stat => {
        return stat.isFile();
      })
      .catch(() => {
        return false;
      });
  }

  Promise.all(files.map(isFile))
    .then(exist => {
      t.equal(exist.length, 3, 'stats.length is 3');
      t.deepEqual(exist, [true, false, false]);
      t.end();
    })
    .catch(error => {
      t.error(error);
      t.end();
    });
});

tape('stats wrong fd', t => {
  var path = resolve(__dirname, './data/nothing-here.txt');

  file
    .stats(-1)
    .then(stats => {
      t.fail('should have no stats');
      t.end();
    })
    .catch(error => {
      t.ok(error, error);
      t.equal(error.code, 'EBADF', 'error.code is EBADF');
      t.equal(error.syscall, 'fstat', 'error.syscall is fstat');
      t.end();
    });
});
