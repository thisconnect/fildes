const { resolve } = require('path');
const test = require('tape');
const { open, close, readFile, writeFile } = require('../../');

const dir = resolve(process.cwd(), './test/data/');

test('writeFile', t => {
  const file1 = resolve(dir, './writefile-1.txt');
  writeFile(file1, 'Hello File!')
    .then(() => readFile(file1, 'utf8'))
    .then(content => {
      t.equal(content, 'Hello File!', 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('writeFile JSON', t => {
  const file2 = resolve(dir, './writefile-2.json');
  writeFile(file2, { data: 1 })
    .then(() => readFile(file2, 'utf8'))
    .then(content => {
      t.equal(content, '{"data":1}', 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('writeFile Buffer', t => {
  const file3 = resolve(dir, './writefile-3.txt');
  writeFile(file3, Buffer.from("I'm a buffer"))
    .then(() => readFile(file3, 'utf8'))
    .then(content => {
      t.equal(content, "I'm a buffer", 'correct content');
      t.end();
    })
    .catch(t.end);
});

test('writeFile Int8Array', t => {
  const file = resolve(dir, './writefile-Int8Array.txt');
  const data = new Int8Array([-1, -2, -3, -4, -5, -6, -7, -8]);
  writeFile(file, data)
    .then(() => readFile(file))
    .then(content => {
      const int8array = new Int8Array(content);
      t.equal(int8array[0], -1);
      t.equal(int8array.length, 8, 'length 8');
      t.deepEqual(int8array, data, 'same Int8Array data');
      t.end();
    })
    .catch(t.end);
});

test('writeFile Uint8Array', t => {
  const file = resolve(dir, './writefile-Uint8Array.txt');
  const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  writeFile(file, data)
    .then(() => readFile(file))
    .then(content => {
      t.equal(content.length, 8, 'length 8');
      t.deepEqual(new Uint8Array(content), data, 'same Uint8Array data');
      t.end();
    })
    .catch(t.end);
});

test('writeFile Uint8ClampedArray', t => {
  const file = resolve(dir, './writefile-Uint8ClampedArray.txt');
  const data = new Uint8ClampedArray([1, 2, 3, 4, 5, 6, 7, 8]);
  writeFile(file, data)
    .then(() => readFile(file))
    .then(content => {
      const uint8clampedarray = new Uint8ClampedArray(content);
      t.equal(content.length, 8, 'length 8');
      t.deepEqual(uint8clampedarray, data, 'same Uint8ClampedArray data');
      t.end();
    })
    .catch(t.end);
});

test('writeFile Int16Array', t => {
  const file = resolve(dir, './writefile-Int16Array.txt');
  const data = new Int16Array([1, 2, 3, 4]);
  writeFile(file, data)
    .then(() => readFile(file))
    .then(({ buffer: arraybuffer }) => {
      const int16array = new Int16Array(arraybuffer);
      t.equal(arraybuffer.byteLength, 8, 'byteLength 8');
      t.equal(int16array.length, 4, 'length 4');
      t.deepEqual(int16array, data, 'same Int16Array data');
      t.end();
    })
    .catch(t.end);
});

// Int8Array
// Uint8Array
// Uint8ClampedArray
// Int16Array
// Uint16Array
// Int32Array
// Uint32Array
// Float32Array
// Float64Array

test('writeFile DataView', t => {
  const file = resolve(dir, './writefile-DataView.txt');
  const data = new DataView(new ArrayBuffer(16));
  data.setInt32(1, 2147483647);
  writeFile(file, data)
    .then(() => readFile(file))
    .then(({ buffer: arraybuffer }) => {
      const dataview = new DataView(arraybuffer);
      t.equal(dataview.getInt32(1), 2147483647, 'is 2147483647');
      t.deepEqual(dataview, data, 'same DataView data');
      t.end();
    })
    .catch(t.end);
});

const file4 = resolve(dir, './writefile/new/file.txt');

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
