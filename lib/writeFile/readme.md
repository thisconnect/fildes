# writeFile (path, data[, options])

Promise uses `fs.writeFile`.

- `path` String | file descriptor (FD, introduced in Node.js 5.x)
- `data` String | Object | Buffer
- `options` Object (optional)
  - `encoding`, `mode`, `flag`


#### Example writing JSON

```javascript
const { writeFile } = require('fildes');

writeFile('./path/to/file.json', { 'data': 1 })
.then(() => console.log('file written'))
.catch(console.error);
```

See also [fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) (Node.js File System API)
