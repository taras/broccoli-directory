import ReduceFilter from './filters/reduce';
import MapFilter from './filters/map';
import FilterFilter from './filters/filter';
import * as Plugin from 'broccoli-plugin';
import * as Funnel from 'broccoli-funnel';
import * as broccoli from 'broccoli';
import * as copyDereference from 'copy-dereference';
import * as BroccoliMergeTrees from 'broccoli-merge-trees';
import * as BroccoliStew from 'broccoli-stew';

export default class Directory {
  private node;

  constructor(node) {
    if (typeof node === 'string') {
      node = new Funnel(node);
    }
    this.node = node;
  }

  /**
   * getCallbackObject, __broccoliFeatures__ and __broccoliGetInfo__
   * make instances of Directory look like Broccoli nodes to Broccoli Builder.
   * The Directory instance delegates build to the node that it wraps.
   */
  getCallbackObject() {
    return this.node;
  }

  __broccoliFeatures__ = Plugin.prototype.__broccoliFeatures__;

  __broccoliGetInfo__(builderFeatures) {
    return Plugin.prototype.__broccoliGetInfo__.bind(this.node)(
      builderFeatures,
    );
  }

  map(callback: (content: string, relativePath: string) => any) {
    let node = new MapFilter(this.node, {
      callback,
    });

    return new Directory(node);
  }

  filter(callback: (content: string, relativePath: string) => any) {
    let node = new FilterFilter(this.node, {
      callback,
    });

    return new Directory(node);
  }

  reduce(
    callback: (accumulator: any, value: any, relativePath: string) => any,
    initialValue: any,
    outputFile: string,
  ) {
    let node = new ReduceFilter(this.node, {
      callback,
      initialValue,
      outputFile,
    });

    return new Directory(node);
  }

  use(callback: (tree) => any) {
    const node = callback(this.node);
    return new Directory(node);
  }

  log(options = { output: 'tree' }) {
    const node = BroccoliStew.log(this.node, options);
    return new Directory(node);
  }

  merge(callback: (tree) => any) {
    const node = new BroccoliMergeTrees([this.node, callback(this.node)]);
    return new Directory(node);
  }

  build(outputDir) {
    let builder = new broccoli.Builder(this);
    let promise = builder.build().then(() => builder);

    if (outputDir) {
      promise.then(builder => {
        copyDereference.sync(builder.outputPath, outputDir);
        return builder;
      });
    }

    return promise;
  }
}
