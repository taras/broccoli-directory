import Filter = require('broccoli-filter');

export default class MapFilter extends Filter {
  private callback;

  constructor(node, options) {
    let { annotation, callback } = options;
    
    super(node, { annotation });

    this.callback = callback;
  }

  processString(content, relativePath) {
    return this.callback(content, relativePath);
  }
}