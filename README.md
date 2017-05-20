# broccoli-directory

Broccoli Directory provides familiar map/reduce/filter APIs for working with Broccoli Trees. It allows to chain broccoli tree transformations in the same way that you would chain array operations.

For example, given a directory like this,

```
my-files/
  some-file.txt
  other-file.txt
  yet-another-file.txt
```

## Using with Broccoli.js

You can get a new directory with whitespace removed from every file by doing the following,

```js
// Broccoli.js
const $d = require('broccoli-directory');

// map will receive content of the file, returned value will be written to the new file
module.exports = $d('my-files')
  .map(text => text.replace(/\s/g,''))
```

You can chain these operations in same way as you would with arrays.

```js
// Broccoli.js
const $d = require('broccoli-directory');

module.exports = $d('my-files')
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
// Broccoli.js
const $d = require('broccoli-directory');

module.exports = $d('my-files')
  .reduce((accumulator, text) => accumulator + text, '', 'result.txt');
  // will build a directoryw result.txt that has content from all files in it 
```

## Using in a node script

You can use this library to process a directory of files in any node.js script.

```js
// index.js
const $d = require('broccoli-directory');

// map will receive content of the file, returned value will be written to the new file
  $d('my-files')
    .map(text => text.replace(/\s/g,''))
    .build('dist') // where should the build result be copied (omit this argument to skip copying)
    .then(builder => {
      // builder.outputPath is path to a tmp directory where the built result is
      return builder.cleanup(); // call builder.cleanup() to remove all temp directories that were created.
    });
```
