# readFile (path[, options])

Promise uses `fs.readFile`.

- `path` String | file descriptor (FD, introduced in Node.js 5.x)
- `options` Object (optional)
  - `encoding`, `flag`

```javascript
const { readFile } = require('fildes');

readFile('./path/to/file.json')
.then(buffer => console.log('got', buffer.toString()))
.catch(console.error);
```

See also [fs.readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_file_options_callback) (Node.js File System API)
