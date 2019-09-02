# mkdir (path)

Provides [make-dir](https://www.npmjs.com/package/make-dir) (NPM Documentation).

- `path` String
- `options` Object (optional)
  - `mode`

```javascript
const { mkdir } = require('fildes');

mkdir('./path/to/dir')
  .then(() => {
    console.log('directory created!');
  })
  .catch(console.error);
```
