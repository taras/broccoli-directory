import ReduceFilter from './filters/reduce';
import MapFilter from './filters/map';
import FilterFilter from './filters/filter';
import Plugin = require('broccoli-plugin');
import Funnel = require('broccoli-funnel');

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
    return Plugin.prototype.__broccoliGetInfo__.bind(this.node)(builderFeatures);
  }

  map(callback: (content: string, relativePath: string) => any) {
    
    let node = new MapFilter(this.node, {
      callback
    });

    return new Directory(node);
  }

  filter(callback: (content: string, relativePath: string) => any) {

    let node = new FilterFilter(this.node, {
      callback
    });

    return new Directory(node);
  }

  reduce(callback: (accumulator: any, value: any, relativePath: string) => any, initialValue: any, outputFile: string) {

    let node = new ReduceFilter(this.node, {
      callback,
      initialValue,
      outputFile
    });

    return new Directory(node);
  }
}