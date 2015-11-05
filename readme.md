Fildes
------

[![Build Status](https://img.shields.io/travis/thisconnect/fildes/master.svg?style=flat-square)](https://travis-ci.org/thisconnect/fildes)
[![Coverage Status](https://img.shields.io/coveralls/thisconnect/fildes/master.svg?style=flat-square)](https://coveralls.io/github/thisconnect/fildes?branch=master)
[![Dependencies](https://img.shields.io/david/thisconnect/fildes.svg?style=flat-square)](https://david-dm.org/thisconnect/fildes)
[![Dev Dependencies](https://img.shields.io/david/dev/thisconnect/fildes.svg?style=flat-square)](https://david-dm.org/thisconnect/fildes#info=devDependencies)

Provides native promises for all file system methods involving fd, basically `fs.open` for you.

> file descriptor (FD, less frequently *fildes*)

[en.wikipedia.org/wiki/File_descriptor](https://en.wikipedia.org/wiki/File_descriptor)


### Install

```bash
npm i --save fildes
```


### Usage

`fildes` always returns a new native [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)!

```javascript
var fildes = require('fildes');

fildes.write('./path/to/file.txt', 'The quick green fix')
.then(function(){
    console.log('done!');
})
.catch(function(err){
    console.error(err.stack);
});
```

##### Manually open and close

```javascript
fildes.open(path)
.then(function(fd){
    // write first time
    return fildes.write(fd, 'Hi there!')
    .then(function(){
        // write second time on the same fd
        return fildes.write(fd, new Buffer('again'), {
            'offset': 0,
            'length': 5,
            'position': 3
        });
    })
    .then(function(){
        // manually close fd
        return fildes.close(fd);
    });
})
.catch(function(error){
    console.error(err.stack);
});
```

##### Get the size of many files

```javascript
var files = ['a.txt', 'b.json', 'c.txt'];

Promise.all(files.map(function(filename){
    var filepath = path.resolve(__dirname, 'sub/dir', filename);
    return fildes.fstat(filepath);
}))
.then(function(stats){
    return stats.map(function(stat){
        return stat.size;
    });
})
.then(function(sizes){
    console.log('got filesizes', sizes);
})
```

### Why?

- I needed an API that returns Promises
- provides nice defaults i.e. suitable flags for `open`, `read` and `write`, see [fildes/issues/1](https://github.com/thisconnect/fildes/issues/2)
- creates a directories if flag is `w`, `w+`, `a` or `a+`
- uses no magic
- promises useful methods, for `copy`, `mkdir`, `rmdir`, etc.
- a very popular fs module uses deprecated `fs.exists()` which should not be used…

> `fs.exists()` should not be used to check if a file exists before calling `fs.open()`. Doing so introduces a race condition since other processes may change the file's state between the two calls. Instead, user code should call `fs.open()` directly and handle the error raised if the file is non-existent.

[fs.exists Stability: 0 - Deprecated](https://nodejs.org/api/fs.html#fs_fs_exists_path_callback) (Node.js v4.2.1 File System API)


## API

- [open](#open-path-options)
- [close](#close-fd)
- [write](#write-path-data-options)
- [read](#read-path-buffer-options)
- [stats](#stats-path-options)
- [truncate](#truncate-path-options)
- [utime](#utime-path-options)
- [chmod](#chmod-path-options)
- [writeFile](#writefile-path-data-options)
- [readFile](#readfile-path-options)
- [unlink](#unlink-path)
- [mkdir](#mkdir-path)
- [rmdir](#rmdir-path)
- [cp](#copy-files-destination-options)


### open (path[, options])

Opens a file descriptor (FD). If `flags` is 'w', 'w+', 'a' or 'a+' open will check for 'ENOENT: no such file or directory' error and try to mkdir. `fildes.open` is used internally for write, read and fstat.

- `path` String
- `options` Object
  - `flag` or `flags` String defaults to 'w+'
  - `mode` String defaults to '0666'

```javascript
fildes.open('./no/file/here.txt', {
    'flag': 'r'
})
.then(function(fd){})
.catch(function(error){
    // returns  { [Error: ENOENT: no such file or directory..
    console.log(error);
});
```

See also [fs.open](https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback) (Node.js File System API)


### close (fd)

Closes a file descriptor (FD).

```javascript
fildes.open('./file.txt')
.then(function(fd){
    // do stuff
    return fildes.close(fd);
})
.then(function(){
    console.log('done!');
});
```


### write (path, data[, options])

Promise to open a file descriptor, write data to it and close it.
Keeps fd open if a fd was passed, only closes if path is a string.
Uses open internally which checks for 'ENOENT' error then tries to mkdir.

If data is type of `Object` it will be converted to JSON.

- `path` String | FD (Number > 0)
- `data` String | Object | Buffer
- `options` Object
  - `flag` or `flags` String defaults to 'w' unless position > 0 in that case it is 'r+', see also [open](#open-path-options)
  - `mode` String, see [open](#open-path-options)
  - If data is of type String or Object,
    [fs.write](https://nodejs.org/api/fs.html#fs_fs_write_fd_data_position_encoding_callback) (Node.js File System API)
    - `position`
    - `encoding` (optional)
  - If data is a Buffer,
    [fs.write](https://nodejs.org/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback) (Node.js File System API)
    - `offset`
    - `length`
    - `position` (optional)


##### Example writing a String

```javascript
fildes.write('./path/to/a/new/dir/file.txt', 'some data\n')
.then(function(){
    console.log('dir created and file written!');
});
```


##### Example writing JSON

```javascript
fildes.write('./path/to/file.json', {
    'some': 'data'
});
```


##### Example using a Buffer

```javascript
var buffer = new Buffer('Hello World!');

fildes.write('./path/to/file.txt', buffer, {
    'offset': 0,
    'length': buffer.length
});
```


See also [writeFile](#writeFile-path-data-options)


### read (path, buffer[, options])

Promise to read a file to a buffer.

- `path` String | FD (Number > 0)
- `buffer` Buffer
- `options` Object
  - `flag` | `flags` String defaults to 'r', see also [open](#open-path-options)
  - `offset` Number
  - `length` Number
  - `position` Number


```javascript
var buffer = new Buffer(8);

fildes.read('./path/to/file.txt', buffer, {
  'offset': 0,
  'length': 8,
  'position': 0
})
.then(function(){
    console.log(buffer.toString());
})
```

See also [readFile](#readFile-path-options)


### stats (path[, options])

Promise file stats. alias for `fildes.fstat`.

- `path` String | File descriptor (Number > 0)
- `options` Object
  - `flag` | `flags` String defaults to 'r', see also [open](#open-path-options)


```javascript
fildes.stats('./path/to/file.txt')
.then(function(stats){
  console.log(stats);
})
```

See also [fs.fstat](https://nodejs.org/api/fs.html#fs_fs_fstat_fd_callback) (Node.js File System API)


### truncate (path[, options])

Promise truncate, alias for `fildes.ftruncate`.

- `path` String | File descriptor (Number > 0)
- `options` Object
  - `flag` | `flags` String defaults to 'r+', see also [open](#open-path-options)
  - `length` | `len` Number, defaults to 0

```javascript
fildes.truncate('./path/to/file.txt', {
    'length': 8
})
```

See also [fs.ftruncate](https://nodejs.org/api/fs.html#fs_fs_ftruncate_fd_len_callback) (Node.js File System API)


### utime (path[, options])

Promise utime, alias for `fildes.futime`.

- `path` String | File descriptor (Number > 0)
- `options` Object
  - `flag` | `flags` String defaults to 'r+', see also [open](#open-path-options)
  - `access` | `atime` UNIX timestamp or Date, defaults to new Date
  - `modification` | `mtime` UNIX timestamp or Date, defaults to new Date

```javascript
fildes.utimes('./path/to/file.txt', {
    'access': Date.now() - (60 * 60 * 1000),
    'modification': new Date('2015-10-26')
})
```

See also [fs.futime](https://nodejs.org/api/fs.html#fs_fs_futimes_fd_atime_mtime_callback) (Node.js File System API)


### chmod (path[, options])

Promise chmod, alias for `fildes.fchmod`.

- `path` String | File descriptor (Number > 0)
- `options` Object
  - `flag` | `flags` String defaults to 'r+', see also [open](#open-path-options)
  - `mode` String | Integer

```javascript
fildes.chmod('./path/to/file.txt', {
  'mode': 0700 // nobody else
})
```


### writeFile (path, data[, options])

Promise uses `fs.writeFile`.

- `path` String
- `data` String | Object | Buffer
- `options` Object (optional)
  - `encoding`, `mode`, `flag`


##### Example writing JSON

```javascript
fildes.writeFile('./path/to/file.json', { 'data': 1 })
```

See also [fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) (Node.js File System API)


### readFile (path[, options])

Promise uses `fs.readFile`.

- `path` String
- `options` Object (optional)
  - `encoding`, `flag`

```javascript
fildes.readFile('./path/to/file.json')
.then(function(buffer){
    console.log('got', buffer.toString());
});
```

See also [fs.readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_file_options_callback) (Node.js File System API)


### unlink (path)

Promise uses [fs.unlink](https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback) (Node.js File System API).

```javascript
fildes.unlink('./path/to/file.txt')
.then(function(){
    console.log('file removed!');
});
```


### mkdir (path)

Promise uses [mkdirp](https://www.npmjs.com/package/mkdirp) (NPM Documentation).

- `path` String
- `options` Object (optional)
  - `mode`

```javascript
fildes.mkdir('./path/to/dir')
.then(function(){
    console.log('directory created!');
});
```


### rmdir (path)

Promise uses [rimraf](https://www.npmjs.com/package/rimraf) (NPM Documentation).

```javascript
fildes.rmdir('./path/to/dir')
.then(function(){
    console.log('directory removed!');
});
```


### copy (files, destination, [options])

Promise `fildes.cp` alias `fildes.copy` uses [cpy](https://www.npmjs.com/package/cpy) (NPM Documentation).

```javascript
fildes.cp(['./data/*.txt'], './destination')
.then(function(){
    console.log('directory copied!');
});
```


### Test

```bash
npm install

npm test

# debug
DEBUG=fildes npm test

# debug all
DEBUG=fildes* npm test
```


## TODO

- Promises for all async fs methods that use fd: fs.fchown, fs.fsync
- Test graceful-fs for ulimit, but include multiple child process (https://github.com/isaacs/node-graceful-fs/issues/48)
- https://github.com/sindresorhus/trash ?
- fs.readdir, fs.rename, fs.link, fs.symlink, fs.appendFile
