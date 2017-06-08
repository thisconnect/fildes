# open (path[, options])

Opens a file descriptor (FD). `fildes.open` is **optional** and useful for multiple operations on the same open FD. *Note*: manually opened FD's have to be closed with `fildes.close`. Open and close is used internally for `fildes.write`, `fildes.read`, `fildes.chmod`, `fildes.stats`, `fildes.truncate` and `fildes.utimes`.

- `path` String
- `options` Object
  - `flag` or `flags` String defaults to 'w+'
  - `mode` String defaults to '0666'

If `flags` is 'w', 'w+', 'a' or 'a+' open will check for 'ENOENT: no such file or directory' error and try to mkdir.


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
