# link (src, dest)

Promise uses [fs.link](https://nodejs.org/api/fs.html#fs_fs_link_srcpath_dstpath_callback) (Node.js File System API).
Performs access test to src path, then tries to link src to destination path.
If an error is caught tries to mkdir destination directory if that fails it rejects.

```javascript
const { link } = require('fildes');

link('./from/file.txt', './to/new/path/file.txt')
  .then(() => console.log('file linked!'))
  .catch(console.error);
```
