import Concat = require('broccoli-concat/concat');
import path = require('path');
import findIndex = require('find-index');

export default class ReduceFilter extends Concat {

  constructor(inputNode, options) {
    let { 
      annotation, 
      callback, 
      initialValue, 
      outputFile,
      inputFiles
    } = options;
    
    class ReduceStrategy extends ConcatStrategy {

      constructor(options) {
        super(options);
        
        this.initialValue = initialValue;
        this.callback = callback;
      }

    }

    super(inputNode, { 
      annotation,
      outputFile,
      inputFiles: inputFiles || ['**/*'],
      enabled: true
    }, ReduceStrategy);
  }
}

class ConcatStrategy {

  static isPatchBased = true;

  protected callback;
  protected internal;
  protected initialValue;

  public outputFile;
  public baseDir;
  public id; 

  constructor(options) {
    this.internal = [];
    this.outputFile = options.outputFile;
    this.baseDir = options.baseDir;
    this.id = options.pluginId;
  }

  addFile(file, content) {
    const entry = {
      file,
      content
    };

    const index = findIndex(this.internal, entry => entry.file > file);
    if (index === -1) {
      this.internal.push(entry);
    } else {
      this.internal.splice(index, 0, entry);
    }
  }

  updateFile(file, content) {

    const index = this._findIndexOf(file);

    if (index === -1) {
      throw new Error('Trying to update ' + file + ' but it has not been read before');
    }

    this.internal[index].content = content;
  }

  removeFile(file) {

    const index = this._findIndexOf(file);

    if (index === -1) {
      throw new Error('Trying to remove ' + file + ' but it did not previously exist');
    }

    this.internal.splice(index, 1);
  }

  result() {
    let result = this.internal.reduce((accumulator, { content, file }) => {
      return this.callback(accumulator, content, file);
    }, this.initialValue);
    
    return `${result}`;
  }

  _findIndexOf(file: string) {
    return findIndex(this.internal, entry => entry.file === file);
  }
}