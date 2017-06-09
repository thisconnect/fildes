/* eslint no-console: 0 */

const { readdir, stats } = require('../../');

const isFile = file => {
  return stats(file).then(stat => (stat.isFile() ? file : false));
};

readdir(process.cwd())
  .then(dir => Promise.all(dir.map(isFile)))
  .then(files => files.filter(file => file))
  .then(console.log)
  .catch(console.error);
