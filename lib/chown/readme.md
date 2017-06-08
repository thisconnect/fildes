# chown (path[, options])

Promise chown, alias for `fildes.fchown`.
Kind of no support for Windows.

- `path` String | file descriptor (FD)
- `options` Object
  - `uid` Integer defaults to process.getuid()
  - `gid` Integer defaults to process.getgid()

```javascript
const { chown } = require('fildes');

chown('./path/to/file.txt')
.then(() => {
  // mine
})
.catch(console.error);
```

See also [fs.fchown](https://nodejs.org/api/fs.html#fs_fs_fchown_fd_uid_gid_callback) (Node.js File System API)
