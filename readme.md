Fildes
------

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
var fildes = require('fildes');

fildes.write('./path/to/file.txt', 'The quick green fix')
.then(function(){
    console.log('done!');
})
.catch(function(error){
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

To install fildes with Node.js 4.x support use

```bash
npm i --save fildes@1x
```


### Examples


#### Get the size of many files

```javascript
function getSize(file){
    return fildes.fstat(file)
    .then(function(stat){
        return stat.size;
    });
}

Promise.all(['a.txt', 'b.json', 'c.txt'].map(getSize))
.then(function(sizes){
    console.log('got filesizes', sizes);
});
```


#### Check if multiple files exist

```javascript
var files = ['buffer.txt', 'nothere.txt', 'dir']
.map(function(file){
    return fildes.fstat(file)
    .then(function(stat){
        return stat.isFile();
    })
    .catch(function(){
        return false;
    });
});

Promise.all(files)
.then(function(result){
    console.log(result);
});
```


#### Read chunk of many files

```javascript
Promise.all(['file.txt', 'file2.txt'].map(function(path){
    return fildes.read(path, {
        'length': 262,
        'position': 0
    });
}))
.then(function(result){
    // chunk of file 1
    console.log(result[0]);
    // chunk of file 2
    console.log(result[1]);
});
```


#### Keep file descriptor (FD) open and use multiple times

```javascript
fildes.open(path)
.then(function(fd){
    // write first time
    return fildes.write(fd, 'Hi there!')
    .then(function(){
        var word = new Buffer('again');
        // write second time on the same fd
        return fildes.write(fd, word, {
            'offset': 0,
            'length': 5,
            'position': 3
        });
    })
    .then(function(){
        return fildes.stats(fd);
    })
    .then(function(stats){
        console.log(stats);
        // manually close fd
        return fildes.close(fd);
    });
})
.catch(function(error){
    console.error(err.stack);
});
```


### Do you need graceful-fs?

If EMFILE, too many open files Errors are expected it is possible to patch the `fs` module with `graceful-fs`,
see [node-graceful-fs#global-patching](https://github.com/isaacs/node-graceful-fs#global-patching).

It also helps with older Node.js environments, but not when using multiple processes, read more
[node-graceful-fs/issues/48](https://github.com/isaacs/node-graceful-fs/issues/48).


## API

- [write](#write-path-data-options)
- [writeFile](#writefile-path-data-options)
- [read](#read-path-buffer-options)
- [readFile](#readfile-path-options)
- [appendFile](#appendfile-path-data-options)
- [access](#access-path-mode)
- [stats](#stats-path-options)
- [truncate](#truncate-path-options)
- [utime](#utime-path-options)
- [chmod](#chmod-path-options)
- [chown](#chown-path-options)
- [sync](#sync-fd)
- [unlink](#unlink-path)
- [link](#link-src-dest)
- [symlink](#symlink-target-path)
- [readdir](#readdir-path)
- [mkdir](#mkdir-path)
- [open](#open-path-options)
- [close](#close-fd)


### write (path, data[, options])

Promise to open a file descriptor, write data to it and close it.
Uses open internally which checks for 'ENOENT' error then tries to mkdir.

If data is type of `Object` it will be converted to JSON.

- `path` String | file descriptor (FD)
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


#### Example writing a String

```javascript
fildes.write('./new/dir/file.txt', 'some data\n')
.then(function(){
    console.log('dir created and file written!');
});
```


#### Example writing JSON

```javascript
fildes.write('./path/to/file.json', {
    'some': 'data'
});
```


#### Example using a Buffer

```javascript
var buffer = new Buffer('Hello World!');

fildes.write('./path/to/file.txt', buffer, {
    'offset': 0,
    'length': buffer.length
});
```


### writeFile (path, data[, options])

Promise uses `fs.writeFile`.

- `path` String | file descriptor (FD, introduced in Node.js 5.x)
- `data` String | Object | Buffer
- `options` Object (optional)
  - `encoding`, `mode`, `flag`


#### Example writing JSON

```javascript
fildes.writeFile('./path/to/file.json', { 'data': 1 });
```

See also [fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) (Node.js File System API)


### read (path[, buffer], options)

Promise to read a file to a buffer.

- `path` String | file descriptor (FD)
- `buffer` Buffer (optional)
- `options` Object
  - `flag` | `flags` String defaults to 'r', see also [open](#open-path-options)
  - `offset` Number defaults to 0 (optional)
  - `length` Number
  - `position` Number (optional)
  - `encoding` String (optional)


```javascript
fildes.read('./path/to/file.txt', {
    'length': 8,
    'encoding': 'utf8'
})
.then(function(content){
    console.log(content);
});
```


#### Read to a Buffer

```javascript
var buffer = new Buffer(8);

fildes.read('./path/to/file.txt', buffer, {
    'offset': 0,
    'length': 8,
    'position': 0
})
.then(function(){
    console.log(buffer.toString());
});
```


### readFile (path[, options])

Promise uses `fs.readFile`.

- `path` String | file descriptor (FD, introduced in Node.js 5.x)
- `options` Object (optional)
  - `encoding`, `flag`

```javascript
fildes.readFile('./path/to/file.json')
.then(function(buffer){
    console.log('got', buffer.toString());
});
```

See also [fs.readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_file_options_callback) (Node.js File System API)


### appendFile (path, data[, options])

Promise uses `fs.appendFile`.

- `path` String | file descriptor (FD, introduced in Node.js 5.x)
- `data` Buffer | String
- `options` Object (optional)
  - `encoding`, `flag`, `mode`

```javascript
fildes.appendFile('./path/to/file.txt', '2015-11-07 GET /robots.txt')
.then(function(){
    console.log('added some data');
});
```

See also [fs.appendFile](https://nodejs.org/api/fs.html#fs_fs_appendfile_file_data_options_callback) (Node.js File System API)


### access (path[, mode])

Promise uses `fs.access`.
`mode` is optional and can be 'r', 'rw', 'rwx', 'rx', 'w', 'wx', 'x'
or a mask consisting of `fs.F_OK`, `fs.R_OK`, `fs.W_OK` or `fs.X_OK`.
`mode` is very limited on Windows, it should be possible to test for 'r'.

- `path` String
- `mode` | `options`
  - `mode` String | Integer

```javascript
fildes.access('./path/to/file.txt')
.then(function(){
  console.log('file exists');
})
.catch(function(error){
  console.log(error);
});
```


```javascript
fildes.access('./path/to/file.txt', 'rwx')
```


```javascript
fildes.access('./path/to/file.txt', fs.R_OK | fs.W_OK)
```


```javascript
fildes.access('./path/to/file.txt', {
    'mode': fs.R_OK | fs.W_OK
})
```


```javascript
fildes.access('./path/to/file.txt', {
    'mode': 'rwx'
})
```

See also [fs.access](https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback) (Node.js File System API)



### stats (path[, options])

Promise file stats. alias for `fildes.fstat`.

- `path` String | file descriptor (FD)
- `options` Object
  - `flag` | `flags` String defaults to 'r', see also [open](#open-path-options)


```javascript
fildes.stats('./path/to/file.txt')
.then(function(stats){
    console.log(stats);
});
```

See also [fs.fstat](https://nodejs.org/api/fs.html#fs_fs_fstat_fd_callback) (Node.js File System API)


### truncate (path[, options])

Promise truncate, alias for `fildes.ftruncate`.

- `path` String | file descriptor (FD)
- `options` Object
  - `flag` | `flags` String defaults to 'r+', see also [open](#open-path-options)
  - `length` | `len` Number, defaults to 0

```javascript
fildes.truncate('./path/to/file.txt', {
    'length': 8
});
```

See also [fs.ftruncate](https://nodejs.org/api/fs.html#fs_fs_ftruncate_fd_len_callback) (Node.js File System API)


### utime (path[, options])

Promise utime, alias for `fildes.futime`.

- `path` String | file descriptor (FD)
- `options` Object
  - `flag` | `flags` String defaults to 'r+', see also [open](#open-path-options)
  - `access` | `atime` UNIX timestamp or Date, defaults to new Date
  - `modification` | `mtime` UNIX timestamp or Date, defaults to new Date

```javascript
fildes.utimes('./path/to/file.txt', {
    'access': Date.now() - (60 * 60 * 1000),
    'modification': new Date('2015-10-26')
});
```

See also [fs.futime](https://nodejs.org/api/fs.html#fs_fs_futimes_fd_atime_mtime_callback) (Node.js File System API)


### chmod (path[, options])

Promise chmod, alias for `fildes.fchmod`.
Kind of no support for Windows.

- `path` String | file descriptor (FD)
- `options` Object
  - `flag` | `flags` String defaults to 'r+', see also [open](#open-path-options)
  - `mode` String | Integer

```javascript
fildes.chmod('./path/to/file.txt', {
    'mode': 0700 // nobody else
});
```

See also [fs.fchmod](https://nodejs.org/api/fs.html#fs_fs_fchmod_fd_mode_callback) (Node.js File System API)


### chown (path[, options])

Promise chown, alias for `fildes.fchown`.
Kind of no support for Windows.

- `path` String | file descriptor (FD)
- `options` Object
  - `uid` Integer defaults to process.getuid()
  - `gid` Integer defaults to process.getgid()

```javascript
fildes.chown('./path/to/file.txt')
.then(function(){
    // mine
});
```

See also [fs.fchown](https://nodejs.org/api/fs.html#fs_fs_fchown_fd_uid_gid_callback) (Node.js File System API)


### sync (fd)

Promise sync, alias for `fildes.fsync`.
Flushes modified data of the file descriptor (FD) to the disk device or other permanent storage device.

- `fd` file descriptor (FD)

```javascript
fildes.sync(fd)
.then(function(){
    // data flushed to storage
});
```

See also [fs.fsync](https://nodejs.org/api/fs.html#fs_fs_fsync_fd_callback) (Node.js File System API)


### unlink (path)

Promise uses [fs.unlink](https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback) (Node.js File System API).

```javascript
fildes.unlink('./path/to/file.txt')
.then(function(){
    console.log('file removed!');
})
.catch(function(error){
    // unlink thorws an error if file not found
});
```


### link (src, dest)

Promise uses [fs.link](https://nodejs.org/api/fs.html#fs_fs_link_srcpath_dstpath_callback) (Node.js File System API).
Performs access test to src path, then tries to link src to destination path.
If an error is caught tries to mkdir destination directory if that fails it rejects.

```javascript
fildes.link('./from/file.txt', './to/new/path/file.txt')
.then(function(){
    console.log('file linked!');
});
```


### symlink (target, path)

Promise uses [fs.symlink](https://nodejs.org/api/fs.html#fs_fs_symlink_destination_path_type_callback) (Node.js File System API).
Tries to symlink target to path.
If an error occurs it tries to mkdir the directory of the path.
Note: On Windows default security policy only allows administrators to create symbolic links,
see [#2274](https://github.com/nodejs/node-v0.x-archive/issues/2274)
and [#6342](https://github.com/nodejs/node-v0.x-archive/issues/6342).

```javascript
fildes.symlink('./from/file.txt', './to/new/path/symlink.txt')
.then(function(){
    console.log('created symlink to file.txt!');
});
```


### rename (oldPath, newPath)

Promise uses [fs.rename](https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback) (Node.js File System API).

```javascript
fildes.rename('./path/to/old.txt', './path/moved/to/new.txt')
.then(function(){
    console.log('file moved!');
})
.catch(function(error){
    // rename thorws an error if file not found
});
```


### readdir (path)

Promise uses [fs.readdir](https://nodejs.org/api/fs.html#fs_fs_readdir_path_callback) (Node.js File System API).

- `path` String

```javascript
fildes.readdir('./path/to/dir')
.then(function(files){
    console.log(files);
})
.catch(function(error){
    // readdir thorws an error no such file or directory
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


### open (path[, options])

Opens a file descriptor (FD). `fildes.open` is **optional** and useful for multiple operations on the same open FD. *Note*: manually opened FD's have to be closed with `fildes.close`. Open and close is used internally for `fildes.write`, `fildes.read`, `fildes.chmod`, `fildes.stats`, `fildes.truncate` and `fildes.utimes`.

- `path` String
- `options` Object
  - `flag` or `flags` String defaults to 'w+'
  - `mode` String defaults to '0666'

If `flags` is 'w', 'w+', 'a' or 'a+' open will check for 'ENOENT: no such file or directory' error and try to mkdir.


```javascript
fildes.open('./no/file/here.txt', {
    'flag': 'r'
})
.then(function(fd){
    // file descriptor (FD)
})
.catch(function(error){
    // returns  { [Error: ENOENT: no such file or directory..
});
```

See also [fs.open](https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback) (Node.js File System API)


### close (fd)

Closes a file descriptor (FD).
Methods generally take care about closing if a path was given.
If a file descriptor (FD) was passed fildes will not close by itself.

```javascript
fildes.open('./file.txt')
.then(function(fd){
    // do something
    // manually close fd
    return fildes.close(fd);
})
.then(function(){
    console.log('done!');
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
