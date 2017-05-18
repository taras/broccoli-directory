import $ from '../index';
import fixturify = require('fixturify');

let dir;
beforeEach(() => {
  dir = $('__tests__/fixtures/testdir').map(content => `*${content}*`);
});

describe('build', () => {

  let outputDir;
  beforeEach(() => {
    return dir.build()
      .then(_outputDir => outputDir = _outputDir);
  });

  test('resolves with output path', () => {
    expect(outputDir).toBeDefined();
    expect(typeof outputDir).toBe('string');
    expect(fixturify.readSync(outputDir)).toEqual({
      'taras.txt': '*taras was here*'
    });
  });

});