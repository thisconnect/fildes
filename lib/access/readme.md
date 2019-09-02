# access (path[, mode])

Promise uses `fs.access`.
`mode` is optional and can be 'r', 'rw', 'rwx', 'rx', 'w', 'wx', 'x'
or a mask consisting of `fs.F_OK`, `fs.R_OK`, `fs.W_OK` or `fs.X_OK`.
`mode` is very limited on Windows, it should be possible to test for 'r'.

- `path` String
- `mode` | `options`
  - `mode` String | Integer

```javascript
const { access } = require('fildes');

access('./path/to/file.txt')
  .then(() => console.log('can read/write'))
  .catch((error) => console.log('no access!'));

access('./path/to/file.txt', 'rwx')
  .catch(console.error);

access('./path/to/file.txt', fs.R_OK | fs.W_OK)
  .catch(console.error);

access('./path/to/file.txt', {
  'mode': 'rwx'
})
  .catch(console.error);

access('./path/to/file.txt', {
  'mode': fs.R_OK | fs.W_OK
})
  .catch(console.error);
```

See also [fs.access](https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback) (Node.js File System API)
