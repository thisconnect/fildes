# Changelog

## v2.0.0

- drop Node.js 4.x
- adds rm (del)
- changes to make-dir
- uses `Buffer.alloc` instead of `new Buffer`
- adds missing fd tests
- api: removes alias
  - `fildes.fchmod`
  - `fildes.ftruncate`
  - `fildes.fstat`
  - `fildes.fsync`
  - `fildes.futimes`

## v1.0.6

- last version supporting Node.js 4.x
