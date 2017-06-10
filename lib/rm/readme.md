# rm (path)

Provides [del](https://www.npmjs.com/package/del) (NPM Documentation).

- `path` String
- `options` Object (optional)
  - `mode`

```javascript
const { rm } = require('fildes');

rm('./path/to/dir')
.then(() => console.log('directory removed!'))
.catch(console.error);
```
