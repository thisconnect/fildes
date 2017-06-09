# Check if multiple files exist

```javascript
const stats = require('fildes/lib/stats');

const files = ['buffer.txt', 'not-there.txt', 'dir']
.map((file) => {
  return stats(file)
  .then(stat => stat.isFile())
  .catch(() => false);
});

Promise.all(files)
.then(result => console.log(result));
```
