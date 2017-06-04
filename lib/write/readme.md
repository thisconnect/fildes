# write (path, data[, options])

Promise to open a file descriptor, write data to it and close it.
Uses open internally which checks for 'ENOENT' error then tries to mkdir.

If data is type of `Object` it will be converted to JSON.

- `path` String | file descriptor (FD)
- `data` String | Object | Buffer
- `options` Object
  - `flag` or `flags` String defaults to 'w' unless position > 0 in that case it is 'r+', see also [open](https://github.com/thisconnect/fildes/tree/master/lib/open)
  - `mode` String, see [open](https://github.com/thisconnect/fildes/tree/master/lib/open)
  - If data is of type String or Object,
    [fs.write](https://nodejs.org/api/fs.html#fs_fs_write_fd_data_position_encoding_callback) (Node.js File System API)
    - `position`
    - `encoding` (optional)
  - If data is a Buffer,
    [fs.write](https://nodejs.org/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback) (Node.js File System API)
    - `offset`
    - `length`
    - `position` (optional)


## Examples

```javascript
const { write } = require('fildes');

// write string to a file
write('./new/dir/file.txt', 'some data\n')
.then(() => console.log('dir created and file written!'))
.catch(console.error);

// write JSON to a file
write('./path/to/file.json', {
  'some': 'data'
})
.catch(console.error);

// write a Buffer to a file
const buffer = new Buffer('Hello World!');
write('./path/to/file.txt', buffer, {
  'offset': 0,
  'length': buffer.length
})
.catch(console.error);
```
