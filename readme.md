Fildes
------

Provides native promises for all file system methods involving fd, basically `fs.open` for you.

> file descriptor (FD, less frequently *fildes*)

[en.wikipedia.org/wiki/File_descriptor](https://en.wikipedia.org/wiki/File_descriptor)


### Install

```javascript
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
})
```


### Why?

Because A) I needed an API that returns Promises and B) a very popular module uses deprecated `fs.exists()`…

> `fs.exists()` should not be used to check if a file exists before calling `fs.open()`. Doing so introduces a race condition since other processes may change the file's state between the two calls. Instead, user code should call `fs.open()` directly and handle the error raised if the file is non-existent.

[fs.exists Stability: 0 - Deprecated](https://nodejs.org/api/fs.html#fs_fs_exists_path_callback) (Node.js v4.2.1 File System API)

## API


### fildes.writeFile(path, data[, options])

Just a promisdified `fs.writeFile`.

- `path` String
- `data` String | Object | Buffer
- `options` Object (optional)
  - `encoding`, `mode`, `flag`  [fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefile_filename_data_options_callback) (Node.js File System API)


##### Example writing JSON

```javascript
fildes.writeFile('./path/to/file.json', { data: 1 })
```


### fildes.write(path, data[, options])

- `path` String | File descriptor (Number > 0)
- `data` String | Object | Buffer
- `options` Object
  - If data is of type String or Object,
    [fs.write](https://nodejs.org/api/fs.html#fs_fs_write_fd_data_position_encoding_callback) (Node.js File System API)
    - `position`
    - `encoding` (optional)
  - If data is a Buffer,
    [fs.write](https://nodejs.org/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback) (Node.js File System API)
    - `offset`
    - `length`
    - `position` (optional)


##### Example writing JSON

```javascript
fildes.write('./path/to/file.json', { some: 'data' })
```


##### Example using a Buffer

```javascript
var buffer = new Buffer('Hello World!');

fildes.write('./path/to/file.txt', buffer, {
    'offset': 0,
    'length': buffer.length
})
```



### fildes.readFile(path)

…

### fildes.read(path)

…

### fildes.stats(path)

…

### fildes.unlink(path)

Just a promisdified `fs.unlink`.

…

### fildes.mkdir(path)

Just a promisdified `mkdirp`.


…

### fildes.rmdir(path)

Just a promisdified `rimraf`.

…

### fildes.copy(path)

Just a promisdified `cpy`.

…


## TODO

- Use graceful-fs but test
- Test for copy
- Docs
- lsof -i -n -P | grep node
- https://github.com/sindresorhus/trash ?
