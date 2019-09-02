# appendFile (path, data[, options])

Promise uses `fs.appendFile`.

- `path` String | file descriptor (FD, introduced in Node.js 5.x)
- `data` Buffer | String
- `options` Object (optional)
  - `encoding`, `flag`, `mode`

```javascript
const { appendFile } = require('fildes');

appendFile('./path/to/file.txt', '2015-11-07 GET /robots.txt')
  .then(() => console.log('added some data'))
  .catch(console.error);
```

See also [fs.appendFile](https://nodejs.org/api/fs.html#fs_fs_appendfile_file_data_options_callback) (Node.js File System API)
