# sync (fd)

Promise sync.
Flushes modified data of the file descriptor (FD) to the disk device or other permanent storage device.

- `fd` file descriptor (FD)

```javascript
const { sync } = require('fildes');

sync(fd)
.then(() => {
  // data flushed to storage
})
.catch(console.error);
```

See also [fs.fsync](https://nodejs.org/api/fs.html#fs_fs_fsync_fd_callback) (Node.js File System API)
