# read (path[, buffer], options)

Promise to read a file to a buffer.

- `path` String | file descriptor (FD)
- `buffer` Buffer (optional)
- `options` Object
  - `flag` | `flags` String defaults to 'r', see also [open](https://github.com/thisconnect/fildes/tree/master/lib/open)
  - `offset` Number defaults to 0 (optional)
  - `length` Number
  - `position` Number (optional)
  - `encoding` String (optional)


## Examples

```javascript
const { read } = require('fildes');

read('./path/to/file.txt', {
  'length': 8,
  'encoding': 'utf8'
})
  .then(console.log)
  .catch(console.error);
```


#### Read to a Buffer

```javascript
const { read } = require('fildes');
const buffer = Buffer.alloc(8);

read('./path/to/file.txt', buffer, {
  'offset': 0,
  'length': 8,
  'position': 0
})
  .then(() => {
    console.log(buffer.toString());
  })
  .catch(console.error);
```
