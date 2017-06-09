/* eslint no-console: 0 */

const { readdir, read } = require('../../');

const tryReading = file => {
  return read(file, {
    length: 262,
    position: 0
  })
    .then(buffer => ({ file, data: buffer.toString() }))
    .catch(() => null);
};

readdir(process.cwd())
  .then(dir => Promise.all(dir.map(tryReading)))
  .then(console.log)
  .catch(console.error);
