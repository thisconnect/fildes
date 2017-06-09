# Read chunk of many files

```javascript
Promise.all(['file.txt', 'file2.txt'].map((path) => {
  return fildes.read(path, {
    'length': 262,
    'position': 0
  });
}))
.then((result) => {
    // chunk of file 1
    console.log(result[0]);
    // chunk of file 2
    console.log(result[1]);
});
```
