import $d from '../index';
import fixturify = require('fixturify');
import tempdirectory = require('tempdirectory');

let dir;
beforeEach(() => {
  dir = $d('__tests__/fixtures/testdir').map(content => `*${content}*`);
});

describe('build', () => {

  test('promise resolves with output path', () => {
    return dir.build()
      .then(builder => {
        expect(builder.outputPath).toBeDefined();
        expect(typeof builder.outputPath).toBe('string');
        expect(fixturify.readSync(builder.outputPath)).toEqual({
          'taras.txt': '*taras was here*'
        });
        return builder.cleanup();
      });
  });

  test('copies files to specified path', () => {
    let temp = tempdirectory();
    return dir.build(temp).then(builder => {
      expect(fixturify.readSync(temp)).toEqual({
        'taras.txt': '*taras was here*'
      });
      return builder.cleanup();
    });
  });

});