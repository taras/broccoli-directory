import Filter = require('broccoli-filter');

export default class MapFilter extends Filter {
  private callback;

  constructor(node, options) {
    let { annotation, callback } = options;
    
    super(node, { annotation });

    this.callback = callback;
  }

  processString(content: string, relativePath: string) {
    let result = this.callback(content, relativePath);
    if (result) {
      return content;
    }
  }
}