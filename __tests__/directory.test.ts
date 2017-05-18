import Directory from '../lib/directory';
import Fixturify = require('broccoli-fixturify');
import broccoli = require('broccoli');
import fixturify = require('fixturify');

let fixtures;
beforeEach(() => {
  fixtures = new Fixturify({
    'a.txt': 'A',
    'b.txt': 'B',
    c: {
      'd.txt': 'D'
    }
  });
});

let builder;
afterEach(() => {
  if (builder) {
    builder.cleanup();
  }
});

describe('instantiation', function() {
  let result;
  beforeEach(() => {
    fixturify.writeSync('testdir', {
      'taras.txt': 'taras was here'
    }); 
    let dir = new Directory('testdir');
    builder = new broccoli.Builder(dir);

    return builder.build()
      .then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
  });

  afterEach(() => {
    fixturify.writeSync('testdir', null); 
  });

  test('from string path', () => {
    expect(result).toEqual({
      'taras.txt': 'taras was here'
    });
  });

});

describe('map', () => {

  let result;
  beforeEach(() => {
    let dir = new Directory(fixtures);

    builder = new broccoli.Builder(
      dir
        .map(content => `<a>${content}</a>`)
    )

    return builder.build()
      .then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
  });

  test('map invokes callback on each object', () => {
    expect(result).toEqual({
      'a.txt': '<a>A</a>',
      'b.txt': '<a>B</a>',
      c: {
        'd.txt': '<a>D</a>'
      }
    });
  });

});

describe('filter', () => {

  let result;
  beforeEach(() => {
    let dir = new Directory(fixtures);

    builder = new broccoli.Builder(
      dir
        .filter(content => content !== 'B')
    )

    return builder.build()
      .then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
  });

  test('filter removes objects that return false', () => {
    expect(result).toEqual({
      'a.txt': 'A',
      c: {
        'd.txt': 'D'
      }
    });
  });

});

describe('reduce', () => {

  let result;
  beforeEach(() => {
    let fixtures = new Fixturify({
      'a.txt': 'a',
      'b.txt': 'b',
      'c.txt': 'c',
      'd.txt': 'd'
    });

    let dir = new Directory(fixtures);

    builder = new broccoli.Builder(
      dir
        .reduce((accumulator, content) => accumulator + content, '', 'result.txt') 
    )

    return builder.build()
      .then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
  });

  test('reduces to a single file', function() {
    expect(result).toEqual({
      'result.txt': 'abcd'
    });
  });

});

describe('composition', () => {

  let result;

  beforeEach(() => {
    let fixtures = new Fixturify({
      'a.txt': '   a   ',
      'b.txt': 'b',
      'c.txt': '      c',
      'd.txt': 'd'
    });

  let dir = new Directory(fixtures);

    builder = new broccoli.Builder(
      dir
        .map(text => text.replace(/\s/g,''))
        .filter(text => text !== 'c')
        .reduce((accumulator, text) => accumulator + text, '', 'result.txt')
        
    );

    return builder.build()
      .then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
  });

  test('all of the filters were applied', function() {
    expect(result).not.toEqual({
      'result.txt': 'abcd'
    });
    expect(result).toEqual({
      'result.txt': 'abd'
    });
  });

});