/* eslint no-console: 0 */

const { open, write, appendFile, stats, readFile, close } = require('../../');
const { resolve } = require('path');

const filepath = resolve(__dirname, './data/dir/subdir/file.txt');

open(filepath)
  .then(fd => {
    return (
      write(fd, 'Hi there!')
        // write again to the same fd
        .then(() =>
          write(fd, new Buffer('again'), {
            offset: 0,
            length: 5,
            position: 3
          })
        )
        .then(() => stats(fd))
        .then(({ size }) => console.log(`filesize ${size}`))
        .then(() => appendFile(fd, '\nagain'))
        .then(() => stats(fd))
        .then(({ size }) => console.log(`filesize ${size}`))
        .then(() => appendFile(fd, '\nand again'))
        .then(() => stats(fd))
        .then(({ size }) => console.log(`filesize ${size}`))
        .then(() => readFile(filepath, { encoding: 'utf8' }))
        .then(data => console.log(data))
        .then(() => close(fd))
    );
  })
  .catch(console.error);
