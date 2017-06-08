# symlink (target, path)

Promise uses [fs.symlink](https://nodejs.org/api/fs.html#fs_fs_symlink_destination_path_type_callback) (Node.js File System API).
Tries to symlink target to path.
If an error occurs it tries to mkdir the directory of the path.
Note: On Windows default security policy only allows administrators to create symbolic links,
see [#2274](https://github.com/nodejs/node-v0.x-archive/issues/2274)
and [#6342](https://github.com/nodejs/node-v0.x-archive/issues/6342).

```javascript
const { symlink } = require('fildes');

symlink('./from/file.txt', './to/new/path/symlink.txt')
.then(() => console.log('created symlink to file.txt!'))
.catch(console.error);
```
