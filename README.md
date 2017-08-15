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

## API

You must begin by selecting a directory,

```js
const $d = require('broccoli-directory');

$d('src')
```

## $d.find(selector: string)

`find` operator allows you to select specific files from the current tree. 

```js
const $d = require('broccoli-directory');

$d('src')
  .find('**/*.js')
// will create a tree of only javascript files
```

## $d.merge(() => IBroccoliTree)

`merge` operation can be used to merge multiple directories together. You must
return a tree from the merge callback. This tree will be merged into your existing tree.

```js
const $d = require('broccoli-directory');

$d('src')
  .merge(() => $('lib')) // merge lib directory with src directory
```

## $d.use((tree: IBroccoliTree) => IBroccoliTree)

`use` operation exects a callback. This callback will be invoked and current tree will be passed as the first argument. You can use this operator to apply Broccoli plugins to the tree.

```js
import $d = require('broccoli-directory');
import Filter = require('broccoli-filter');

class Empasize extends Filter {
  processString(contents) {
    return `*${contents}*`;
  }
}

$d('src')
  .use((tree) => new Empasize(tree));
// resulting directory will have * wrapping the content
```

## $d.map((content: string) => string)

`map` operation allows to transform every file in the directory. `map` expects a callback which receives a string and returns a string.

```js

$d('src')
  .map(content => `<a>${content}</a>`)
// resulting directory will have <a></a> wrapping the content
```

## $d.filter((content: string, relativePath: string) => boolean)

`filter` operation allows to remove files from a directory. It expects a callback which will accept the file content and relative path. If the callback returns a falsy value then the file will be excluded from the output.

```js
$d('src')
  .filter((content, relativePath) => !relativePath.startsWith('fixtures'))
```

## $d.reduce((accumulator: string, content: string) => string, intial: string, outputFile: string)

`reduce` operation allows to concatinate all files in a tree into as single file. 

It expects 3 arguments:
1. callback - function that will be invoked for every file in the tree. The callback will receive as arguments an accumulator that'll contain the result of previous operation and string content of current file.  
2. initial - string that'll contain value that'll be passed as the accumulator to the first invocation of the callback.
3. ouputFile - string path where the result will be written.

```js
$d('src')
  .reduce((accumulator, content) => `${accumulator}${content}`, '', 'result.txt')
```

## $d.log

`log` operator will output the state of the tree to console. This is useful when you're debugging a tree build.

```js
$d('src')
  .log()
/**
 * tree = log(tree, {output: 'tree'});
 * // /Users/chietala/workspace/broccoli-stew/tmp/funnel-dest_Q1EeTD.tmp
 * // ├── cat.js
 * // └── dog.js
 */
```