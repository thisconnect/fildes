# Keep file descriptor (FD) open and use multiple times

```javascript
fildes.open(path)
.then((fd) => {
  // write first time
  return fildes.write(fd, 'Hi there!')
  .then(() => {
    var word = new Buffer('again');
    // write second time on the same fd
    return fildes.write(fd, word, {
      'offset': 0,
      'length': 5,
      'position': 3
    });
  })
  .then(() => {
    return fildes.stats(fd);
  })
  .then((stats) => {
    console.log(stats);
    // manually close fd
    return fildes.close(fd);
  });
})
.catch((error) => {
  console.error(err.stack);
});
```
