Fildes
------

[![Build Status](https://travis-ci.org/thisconnect/fildes.svg?branch=master)](https://travis-ci.org/thisconnect/fildes)

Provides native promises for all file system methods involving fd, basically `fs.open` for you.

> file descriptor (FD, less frequently *fildes*)

[en.wikipedia.org/wiki/File_descriptor](https://en.wikipedia.org/wiki/File_descriptor)


### Install

```bash
npm i --save fildes
```


### Use

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


### Why?

Because A) I needed an API that returns Promises and B) a very popular module uses deprecated `fs.exists()`…

> `fs.exists()` should not be used to check if a file exists before calling `fs.open()`. Doing so introduces a race condition since other processes may change the file's state between the two calls. Instead, user code should call `fs.open()` directly and handle the error raised if the file is non-existent.

[fs.exists Stability: 0 - Deprecated](https://nodejs.org/api/fs.html#fs_fs_exists_path_callback) (Node.js v4.2.1 File System API)


## API

- [open](#open-path-options)
- [close](#close-fd)
- [write](#write-path-data-options)
- [read](#read-path-data-options)
- [stats](#stats-path-options)
- [writeFile](#writefile-path-data-options)
- [readFile](#readfile-path-options)
- [unlink](#unlink-path)
- [mkdir](#mkdir-path)
- [rmdir](#rmdir-path)
- [cp](#copy-files-destination-options)

(GitHub uses a sligthly different anchor ID than NPM, this list only works on https://www.npmjs.com/package/fildes)


### open(path[, options])

Opens a file descriptor. If `flags` is 'w', 'w+', 'a' or 'a+' open will try to mkdir on 'ENOENT: no such file or directory' error. `fildes.open` is used internally for write, read and fstat.

- `path` String
- `options` Object
  - `flags` String defaults to 'w+'
  - `mode` String defaults to '0666'

```javascript
fildes.open('./no/file/here.txt', {
    'flags': 'r'
})
.then(function(fd){})
.catch(function(error){
    // returns  { [Error: ENOENT: no such file or directory..
    console.log(error);
});
```


### close(fd)

Closes a file descriptor.

```javascript
fildes.open('./file.txt')
.then(function(fd){
    // do stuff
    return fildes.close(fd)
})
.then(function(){
    console.log('done!');
});
```


### write(path, data[, options])

Promise to open a file descriptor, write data to it and close it.
Keeps fd open if path was a fd, only closes if path is a string.

If data is type of `Object` it will be converted to JSON.

- `path` String | File descriptor (Number > 0)
- `data` String | Object | Buffer
- `options` Object
  - `flags` String defaults to 'w', see also [open](#open)
  - `mode` String, see [open](#open)
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
fildes.write('./path/to/file.txt', 'some data')
.then(function(){
    console.log('done');
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


### read(path, buffer[, options])

Promise to read a file to a buffer.

- `path` String | File descriptor (Number > 0)
- `buffer` Buffer
- `options` Object
  - `flags` String defaults to 'r', see also [open](#open)
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


### stats(path[, options])

Promise file stats. alias for `fildes.fstat`.

- `path` String | File descriptor (Number > 0)
- `options` Object
  - `flags` String defaults to 'r', see also [open](#open)


```javascript
fildes.stats('./path/to/file.txt')
.then(function(stats){
  console.log(stats);
})
```

See also [fs.fstat](https://nodejs.org/api/fs.html#fs_fs_fstat_fd_callback) (Node.js File System API)


### writeFile(path, data[, options])

Promise uses `fs.writeFile`.

- `path` String
- `data` String | Object | Buffer
- `options` Object (optional)
  - `encoding`, `mode`, `flag`


##### Example writing JSON

```javascript
fildes.writeFile('./path/to/file.json', { 'data': 1 })
```

See also [fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefile_filename_data_options_callback) (Node.js File System API)


### readFile(path[, options])

Promise uses `fs.readFile`.

```javascript
fildes.readFile('./path/to/file.json')
.then(function(buffer){
    console.log('got', buffer.toString());
});
```

See also [fs.readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback) (Node.js File System API)


### unlink(path)

Promise uses [fs.unlink](https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback) (Node.js File System API).

```javascript
fildes.unlink('./path/to/file.txt')
.then(function(){
    console.log('file removed!');
});
```


### mkdir(path)

Promise uses [mkdirp](https://www.npmjs.com/package/mkdirp) (NPM Documentation).

```javascript
fildes.mkdir('./path/to/dir')
.then(function(){
    console.log('directory created!');
});
```


### rmdir(path)

Promise uses [rimraf](https://www.npmjs.com/package/rimraf) (NPM Documentation).

```javascript
fildes.rmdir('./path/to/dir')
.then(function(){
    console.log('directory removed!');
});
```


### copy(files, destination, [options])

Promise `fildes.cp` alias `fildes.copy` uses [cpy](https://www.npmjs.com/package/cpy) (NPM Documentation).

```javascript
fildes.cp(['./data/*.txt'], './destination')
.then(function(){
    console.log('directory copied!');
});
```


## TODO

- Test graceful-fs for ulimit, but include multiple child process (https://github.com/isaacs/node-graceful-fs/issues/48)
- https://github.com/sindresorhus/trash ?
