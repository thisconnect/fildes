# readdir (path)

Promise uses [fs.readdir](https://nodejs.org/api/fs.html#fs_fs_readdir_path_callback) (Node.js File System API).

- `path` String

```javascript
const { readdir } = require('fildes');

readdir('./path/to/dir')
.then(files => console.log(files))
.catch(error => {
  // readdir thorws an error no such file or directory
});
```
