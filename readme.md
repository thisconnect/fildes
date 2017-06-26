# fildes

[![Build Status](https://img.shields.io/travis/thisconnect/fildes/master.svg?style=flat-square&maxAge=1800)](https://travis-ci.org/thisconnect/fildes)
[![Build Status](https://img.shields.io/appveyor/ci/thisconnect/fildes/master.svg?style=flat-square&maxAge=1800)](https://ci.appveyor.com/project/thisconnect/fildes)
[![Coverage Status](https://img.shields.io/codecov/c/github/thisconnect/fildes/master.svg?style=flat-square&maxAge=1800)](https://codecov.io/gh/thisconnect/fildes)
[![Dependencies](https://img.shields.io/bithound/dependencies/github/thisconnect/fildes.svg?style=flat-square&maxAge=1800)](https://www.bithound.io/github/thisconnect/fildes)
[![MIT](https://img.shields.io/npm/l/fildes.svg?style=flat-square&maxAge=1800)](https://github.com/thisconnect/fildes/blob/master/license)
[![NPM Version](https://img.shields.io/npm/v/fildes.svg?style=flat-square&maxAge=1800)](https://www.npmjs.com/package/fildes)

Provides native promises for all file system methods involving file descriptors (FD), basically manages `fs.open` for you.

> file descriptor (FD, less frequently *fildes*)

[en.wikipedia.org/wiki/File_descriptor](https://en.wikipedia.org/wiki/File_descriptor)


## Usage

`fildes` always return a new [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)!

```javascript
const { write } = require('fildes');

write('./path/to/file.txt', 'The quick green fix')
  .then(() => console.log('done!'))
  .catch(console.error);
```


### Why?

- I needed an API that returns Promises
- provides smart defaults i.e. suitable flags for `open`, `read` and `write`, see [fildes/issues/1](https://github.com/thisconnect/fildes/issues/1)
- creates a directories if flag is `w`, `w+`, `a` or `a+`
- `open` is optional and useful for keeping the fd for multiple operations
- uses no magic
- some very popular node modules use `fs.exists()` which is deprecated…

> `fs.exists()` should not be used to check if a file exists before calling `fs.open()`. Doing so introduces a race condition since other processes may change the file's state between the two calls. Instead, user code should call `fs.open()` directly and handle the error raised if the file is non-existent.

[fs.exists Stability: 0 - Deprecated](https://nodejs.org/api/fs.html#fs_fs_exists_path_callback) (Node.js v5.1.0 File System API)


##### Bad (NOT RECOMMENDED)

```javascript
fs.exists('myfile', (exists) => {
  if (exists) {
    console.error('myfile already exists');
  } else {
    fs.open('myfile', 'wx', (err, fd) => {
      if (err) throw err;
      fs.write(fd, 'Hello', callback);
    });
  }
});
```


##### Good (RECOMMENDED)

```javascript
fs.open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  fs.write(fd, 'Hello', callback);
});
```


##### Using `fildes`

```javascript
const { open, write, close } = require('fildes');

open('myfile', { flag: 'wx' })
.then(fd => {
  return write(fd, 'Hello')
  .then(() => close(fd));
})
.catch(console.error);
```

This is the same as:

```javascript
const { write } = require('fildes');

write('myfile', 'Hello', { flag: 'wx' })
.catch(console.error);
```


## Install

```bash
npm i --save fildes
```

`fildes` with support for Node.js 4.x can be found here https://github.com/thisconnect/fildes/tree/v1.x


## API

- [access](https://github.com/thisconnect/fildes/tree/master/lib/access)
- [appendFile](https://github.com/thisconnect/fildes/tree/master/lib/appendFile)
- [chmod](https://github.com/thisconnect/fildes/tree/master/lib/chmod)
- [chown](https://github.com/thisconnect/fildes/tree/master/lib/chown)
- [close](https://github.com/thisconnect/fildes/tree/master/lib/close)
- [link](https://github.com/thisconnect/fildes/tree/master/lib/link)
- [mkdir](https://github.com/thisconnect/fildes/tree/master/lib/mkdir)
- [open](https://github.com/thisconnect/fildes/tree/master/lib/open)
- [read](https://github.com/thisconnect/fildes/tree/master/lib/read)
- [readdir](https://github.com/thisconnect/fildes/tree/master/lib/readdir)
- [readFile](https://github.com/thisconnect/fildes/tree/master/lib/readFile)
- [rename](https://github.com/thisconnect/fildes/tree/master/lib/rename)
- [rm](https://github.com/thisconnect/fildes/tree/master/lib/rm)
- [stats](https://github.com/thisconnect/fildes/tree/master/lib/stats)
- [symlink](https://github.com/thisconnect/fildes/tree/master/lib/symlink)
- [sync](https://github.com/thisconnect/fildes/tree/master/lib/sync)
- [truncate](https://github.com/thisconnect/fildes/tree/master/lib/truncate)
- [unlink](https://github.com/thisconnect/fildes/tree/master/lib/unlink)
- [utimes](https://github.com/thisconnect/fildes/tree/master/lib/utimes)
- [write](https://github.com/thisconnect/fildes/tree/master/lib/write)
- [writeFile](https://github.com/thisconnect/fildes/tree/master/lib/writeFile)


### Examples

- [Get the size of many files](https://github.com/thisconnect/fildes/tree/master/examples/get-sizes)
- [List files](https://github.com/thisconnect/fildes/tree/master/examples/list-files)
- [Keep file descriptor (FD) open and use multiple times](https://github.com/thisconnect/fildes/tree/master/examples/operate-on-fd)
- [Read chunk of many files](https://github.com/thisconnect/fildes/tree/master/examples/read-chunks)
