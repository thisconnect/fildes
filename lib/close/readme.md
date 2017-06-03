# close (fd)

Closes a file descriptor (FD).
Methods generally take care about closing if a path was given.
If a file descriptor (FD) was passed to any method (other than close)
fildes will not close the file descriptor (FD) by itself.

```javascript
const { open, close } = require('fildes');

open('./file.txt')
.then((fd) => {
  // do something
  // manually close fd
  return close(fd);
})
.then(() => console.log('done!'))
.catch(console.error);
```
