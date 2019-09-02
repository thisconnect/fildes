# open (path[, options])

Opens a file descriptor (FD). `fildes.open` is **optional** and useful for multiple operations on the same open FD. *Note*: manually opened FD's have to be closed with `fildes.close`. Open and close is used internally for `fildes.write`, `fildes.read`, `fildes.chmod`, `fildes.stats`, `fildes.truncate` and `fildes.utimes`.

- `path` String
- `options` Object
  - `flag` or `flags` String defaults to `'w+'`
  - `mode` String defaults to '0666'

If `flags` is `'w'`, `'w+'`, `'a'` or `'a+'` open will check for 'ENOENT: no such file or directory' error and try to mkdir.


```javascript
// const open = require('fildes/lib/open');
const { open } = require('fildes');

open('./no/file/here.txt', {
  'flag': 'r'
})
  .then(fd => {
    // file descriptor (FD)
  })
  .catch(error => {
    // returns  { [Error: ENOENT: no such file or directory..
  });
```

See also [fs.open](https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback) (Node.js File System API)

### About flags

- `'r'` - Open file for reading. An exception occurs if the file does not exist.

- `'r+'` - Open file for reading and writing. An exception occurs if the file does not exist.

- `'rs+'` - Open file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache.

  This is primarily useful for opening files on NFS mounts as it allows skipping the potentially stale local cache. It has a very real impact on I/O performance so using this flag is not recommended unless it is needed.

  Note that this doesn't turn `fs.open()` into a synchronous blocking call. If synchronous operation is desired `fs.openSync()` should be used.

- `'w'` - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).

- `'wx'` - Like `'w'` but fails if path exists.

- `'w+'` - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).

- `'wx+'` - Like `'w+'` but fails if path exists.

- `'a'` - Open file for appending. The file is created if it does not exist.

- `'ax'` - Like `'a'` but fails if path exists.

- `'a+'` - Open file for reading and appending. The file is created if it does not exist.

- `'ax+'` - Like `'a+'` but fails if path exists.


Source: [fs.open](https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback) (Node.js File System API)
