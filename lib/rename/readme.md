# rename (oldPath, newPath)

Promise uses [fs.rename](https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback) (Node.js File System API).

```javascript
const { rename } = require('fildes');

rename('./path/to/old.txt', './path/moved/to/new.txt')
.then(() => console.log('file moved!'))
.catch((error) => {
  // rename thorws an error if file not found
});
```
