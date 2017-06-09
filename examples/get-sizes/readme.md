# Get the size of many files

```javascript
const stats = require('fildes/lib/stats');

const getSize = file => {
  return stats(file).then(({ size }) => {
    return { file, size };
  });
};

Promise.all(['a.html', 'b.json', 'c.txt'].map(getSize))
  .then(sizes => console.log(sizes))
  .catch(console.error);
```
