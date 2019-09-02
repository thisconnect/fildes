# chmod (path[, options])

Promise chmod, alias for `fildes.fchmod`.
Kind of no support for Windows.

- `path` String | file descriptor (FD)
- `options` Object
  - `flag` | `flags` String defaults to 'r+', see also [open](https://github.com/thisconnect/fildes/tree/master/lib/open)
  - `mode` String | Integer

```javascript
const { chmod } = require('fildes');

chmod('./path/to/file.txt', {
  'mode': 0700 // nobody else
})
  .catch(console.error);
```

See also [fs.fchmod](https://nodejs.org/api/fs.html#fs_fs_fchmod_fd_mode_callback) (Node.js File System API)
