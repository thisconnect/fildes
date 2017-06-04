# Fildes

[![Build Status](https://img.shields.io/travis/thisconnect/fildes/master.svg?style=flat-square&maxAge=1800)](https://travis-ci.org/thisconnect/fildes)
[![Build Status](https://img.shields.io/appveyor/ci/thisconnect/fildes/master.svg?style=flat-square&maxAge=1800)](https://ci.appveyor.com/project/thisconnect/fildes)
[![Coverage Status](https://img.shields.io/coveralls/thisconnect/fildes/master.svg?style=flat-square&maxAge=1800)](https://coveralls.io/github/thisconnect/fildes?branch=master)
[![Dependencies](https://img.shields.io/david/thisconnect/fildes.svg?style=flat-square&maxAge=1800)](https://david-dm.org/thisconnect/fildes)
[![Dev Dependencies](https://img.shields.io/david/dev/thisconnect/fildes.svg?style=flat-square&maxAge=1800)](https://david-dm.org/thisconnect/fildes?type=dev)
[![MIT](https://img.shields.io/npm/l/fildes.svg?style=flat-square&maxAge=1800)](https://github.com/thisconnect/fildes/blob/master/license)
[![NPM Version](https://img.shields.io/npm/v/fildes.svg?style=flat-square&maxAge=1800)](https://www.npmjs.com/package/fildes)

Provides native promises for all file system methods involving file descriptors (FD), basically manages `fs.open` for you.

> file descriptor (FD, less frequently *fildes*)

[en.wikipedia.org/wiki/File_descriptor](https://en.wikipedia.org/wiki/File_descriptor)


### Usage

`fildes` always return a new [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)!

```javascript
var { write } = require('fildes');

write('./path/to/file.txt', 'The quick green fix')
.then(() => {
  console.log('done!');
})
.catch((error) => {
  // error
});
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


### Install

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
- [stats](https://github.com/thisconnect/fildes/tree/master/lib/stats)
- [symlink](https://github.com/thisconnect/fildes/tree/master/lib/symlink)
- [sync](https://github.com/thisconnect/fildes/tree/master/lib/sync)
- [truncate](https://github.com/thisconnect/fildes/tree/master/lib/truncate)
- [unlink](https://github.com/thisconnect/fildes/tree/master/lib/unlink)
- [utimes](https://github.com/thisconnect/fildes/tree/master/lib/utimes)
- [write](https://github.com/thisconnect/fildes/tree/master/lib/write)
- [writeFile](https://github.com/thisconnect/fildes/tree/master/lib/writeFile)


### Examples


#### Get the size of many files

```javascript
function getSize(file) {
  return fildes.fstat(file)
  .then((stat) => stat.size);
}

Promise.all(['a.txt', 'b.json', 'c.txt'].map(getSize))
.then((sizes) => console.log('got filesizes', sizes));
```


#### Check if multiple files exist

```javascript
var files = ['buffer.txt', 'nothere.txt', 'dir']
.map((file) => {
  return fildes.fstat(file)
  .then((stat) => stat.isFile())
  .catch(() => false);
});

Promise.all(files)
.then(result => console.log(result));
```


#### Read chunk of many files

```javascript
Promise.all(['file.txt', 'file2.txt'].map((path) => {
  return fildes.read(path, {
    'length': 262,
    'position': 0
  });
}))
.then((result) => {
    // chunk of file 1
    console.log(result[0]);
    // chunk of file 2
    console.log(result[1]);
});
```


#### Keep file descriptor (FD) open and use multiple times

```javascript
fildes.open(path)
.then((fd) => {
  // write first time
  return fildes.write(fd, 'Hi there!')
  .then(() => {
    var word = new Buffer('again');
    // write second time on the same fd
    return fildes.write(fd, word, {
      'offset': 0,
      'length': 5,
      'position': 3
    });
  })
  .then(() => {
    return fildes.stats(fd);
  })
  .then((stats) => {
    console.log(stats);
    // manually close fd
    return fildes.close(fd);
  });
})
.catch((error) => {
  console.error(err.stack);
});
```


### Do you need `graceful-fs`?

If EMFILE, too many open files Errors, are expected it is possible to patch the `fs` module with `graceful-fs`,
see [node-graceful-fs#global-patching](https://github.com/isaacs/node-graceful-fs#global-patching).

It also helps with older Node.js environments, but not when using multiple processes, read more
[node-graceful-fs/issues/48](https://github.com/isaacs/node-graceful-fs/issues/48).


### Test

```bash
git clone https://github.com/thisconnect/fildes.git
cd fildes
npm install
npm test
```
