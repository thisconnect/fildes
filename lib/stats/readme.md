# stats (path[, options])

Promise file stats.

- `path` String | file descriptor (FD)
- `options` Object
  - `flag` | `flags` String defaults to 'r', see also [open](#open-path-options)


```javascript
const { stats } = require('fildes');

stats('./path/to/file.txt')
.then((stats) => console.log(stats))
.catch(console.error);
```

See also [fs.fstat](https://nodejs.org/api/fs.html#fs_fs_fstat_fd_callback) (Node.js File System API)
