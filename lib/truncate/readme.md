# truncate (path[, options])

Promise truncate.

- `path` String | file descriptor (FD)
- `options` Object
  - `flag` | `flags` String defaults to 'r+', see also [open](https://github.com/thisconnect/fildes/tree/master/lib/open)
  - `length` | `len` Number, defaults to 0

```javascript
const { truncate } = require('fildes');
truncate('./path/to/file.txt', {
  'length': 8
})
.catch(console.error);
```

See also [fs.ftruncate](https://nodejs.org/api/fs.html#fs_fs_ftruncate_fd_len_callback) (Node.js File System API)
