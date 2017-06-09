/* eslint no-console: 0 */

const { readdir, stats } = require('../../');

const getSize = file => {
  return stats(file).then(({ size }) => {
    return { file, size };
  });
};

readdir(process.cwd())
  .then(files => Promise.all(files.map(getSize)))
  .then(console.log)
  .catch(console.error);
