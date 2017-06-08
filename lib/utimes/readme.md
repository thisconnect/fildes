# utimes (path[, options])

Promise utimes.

- `path` String | file descriptor (FD)
- `options` Object
  - `flag` | `flags` String defaults to 'r+', see also [open](https://github.com/thisconnect/fildes/tree/master/lib/open)
  - `access` | `atime` UNIX timestamp or Date, defaults to new Date
  - `modification` | `mtime` UNIX timestamp or Date, defaults to new Date

```javascript
const { utimes } = require('fildes');

utimes('./path/to/file.txt', {
  'access': Date.now() - (60 * 60 * 1000),
  'modification': new Date('2015-10-26')
})
.catch(console.error);
```

See also [fs.futimes](https://nodejs.org/api/fs.html#fs_fs_futimes_fd_atime_mtime_callback) (Node.js File System API)
