import Directory from '../lib/directory';
import * as Fixturify from 'broccoli-fixturify';
import * as broccoli from 'broccoli';
import * as fixturify from 'fixturify';
import * as Filter from 'broccoli-filter';

describe('directory', () => {
  let fixtures;
  beforeEach(() => {
    fixtures = new Fixturify({
      'a.txt': 'A',
      'b.txt': 'B',
      c: {
        'd.txt': 'D',
      },
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
      let dir = new Directory('__tests__/fixtures/testdir');
      builder = new broccoli.Builder(dir);

      return builder.build().then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
    });

    test('from string path', () => {
      expect(result).toEqual({
        'taras.txt': 'taras was here',
      });
    });
  });

  describe('map', () => {
    let result;
    beforeEach(() => {
      let dir = new Directory(fixtures);

      builder = new broccoli.Builder(dir.map(content => `<a>${content}</a>`));

      return builder.build().then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
    });

    test('map invokes callback on each object', () => {
      expect(result).toEqual({
        'a.txt': '<a>A</a>',
        'b.txt': '<a>B</a>',
        c: {
          'd.txt': '<a>D</a>',
        },
      });
    });
  });

  describe('filter', () => {
    let result;
    beforeEach(() => {
      let dir = new Directory(fixtures);

      builder = new broccoli.Builder(dir.filter(content => content !== 'B'));

      return builder.build().then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
    });

    test('filter removes objects that return false', () => {
      expect(result).toEqual({
        'a.txt': 'A',
        c: {
          'd.txt': 'D',
        },
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
        'd.txt': 'd',
      });

      let dir = new Directory(fixtures);

      builder = new broccoli.Builder(
        dir.reduce(
          (accumulator, content) => accumulator + content,
          '',
          'result.txt',
        ),
      );

      return builder.build().then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
    });

    test('reduces to a single file', function() {
      expect(result).toEqual({
        'result.txt': 'abcd',
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
        'd.txt': 'd',
      });

      let dir = new Directory(fixtures);

      builder = new broccoli.Builder(
        dir
          .map(text => text.replace(/\s/g, ''))
          .filter(text => text !== 'c')
          .reduce((accumulator, text) => accumulator + text, '', 'result.txt'),
      );

      return builder.build().then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
    });

    test('all of the filters were applied', function() {
      expect(result).not.toEqual({
        'result.txt': 'abcd',
      });
      expect(result).toEqual({
        'result.txt': 'abd',
      });
    });
  });

  describe('merge', () => {
    let result;

    beforeEach(() => {
      let a = new Fixturify({
        'a.txt': 'a',
      });

      let b = new Fixturify({
        'b.txt': 'b',
      });

      let $da = new Directory(a);
      let $db = new Directory(b);

      builder = new broccoli.Builder($da.merge(() => $db));

      return builder.build().then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
    });

    test('all of the filters were applied', function() {
      expect(result).toEqual({
        'a.txt': 'a',
        'b.txt': 'b',
      });
    });
  });

  describe('use', () => {
    let result;

    beforeEach(() => {
      let a = new Fixturify({
        'a.txt': 'a',
      });

      class Emphasize extends Filter {
        constructor(inputNode) {
          super(inputNode);
        }
        processString(contents) {
          return `*${contents}*`;
        }
      }

      let $d = new Directory(a);

      builder = new broccoli.Builder($d.use(tree => new Emphasize(tree)));

      return builder.build().then(() => {
        result = fixturify.readSync(builder.outputPath);
      });
    });

    test('all of the filters were applied', function() {
      expect(result).toEqual({
        'a.txt': '*a*',
      });
    });
  });
});
