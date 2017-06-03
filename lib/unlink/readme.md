# unlink (path)

Promise uses [fs.unlink](https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback) (Node.js File System API).

```javascript
const { unlink } = require('fildes');

unlink('./path/to/file.txt')
.then(() => console.log('file removed!'))
.catch((error) => {
  // unlink thorws an error if file not found
});
```
