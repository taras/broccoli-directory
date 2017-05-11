import ReduceFilter from './filters/reduce';
import MapFilter from './filters/map';
import FilterFilter from './filters/filter';

export default class Directory {
  private node;

  constructor(node) {
    this.node = node;
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

  toTree() {
    return this.node;
  }
}