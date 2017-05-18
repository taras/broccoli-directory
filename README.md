# broccoli-directory

Broccoli Directory provides familiar map/reduce/filter APIs for working with Broccoli Trees. It allows to chain broccoli tree transformations in the same way that you would chain array operations.

For example, given a directory like this,

```
my-files/
  some-file.txt
  other-file.txt
  yet-another-file.txt
```

You can get a new directory with whitespace removed from every file by doing the following,

```js
// Broccoli.js
const Directory = require('broccoli-directory');

let dir = new Directory('my-files');

module.exports = dir
  // map will receive content of the file, returned value will be written to the new file
  .map(text => text.replace(/\s/g,''))
```

You can chain these operations in same way as you would with arrays.

```js
const Directory = require('broccoli-directory');

let dir = new Directory('my-files');

module.exports = dir
  // exclude other-file.txt from build
  .filter((text, relativePath) => relativePath !== 'other-file.txt')
  // remote whitespace from remaining files
  .map(text => text.replace(/\s/g,''));
  // this will produce a directory with
  // some-file.txt
  // yet-another-file.txt
```

You can also reduce a directory into a single file.

```js
const Directory = require('broccoli-directory');

let dir = new Directory('my-files');

module.exports = dir
  .reduce((accumulator, text) => accumulator + text, '', 'result.txt');
  // will build a directoryw result.txt that has content from all files in it 
```

There is lots more that can be done with this pattern, but this is a proof of concept. Let me know what you think about this.
