var assert = require("assert");
var seqal = require("../src/seqal");

function simpleSimilarity(c, d) {
  return c === d ? 1 : -1;
}

function simpleGap(i) {
  return -i;
}

describe('alignmentMatrix', function () {
  it('works for tiny alignments', function () {
    var alignmentMatrix = seqal.alignmentMatrix('1', '1', simpleSimilarity, simpleGap);
    assert.deepEqual([
      [0, -1],
      [-1, 1]
    ], alignmentMatrix.similarity);
    assert.deepEqual([
      ['', ''],
      ['', 'D']
    ], alignmentMatrix.traceback);


  });
  it('works for small alignments', function () {
    var alignmentMatrix = seqal.alignmentMatrix('12', '102', simpleSimilarity, simpleGap);
    assert.deepEqual([
      /*          1   0    2 */
      /*   */[0, -1, -2 , -3],
      /* 1 */[-1, 1 , 0, -1],
      /* 2 */[-2, 0 , 0, 1]
    ], alignmentMatrix.similarity);

    assert.deepEqual([
      [ '', '', '', '' ],
      [ '', 'D', 'L', 'L' ],
      [ '', 'T', 'D', 'D' ]
    ], alignmentMatrix.traceback);

  });


  /**
   * http://de.wikipedia.org/wiki/Needleman-Wunsch-Algorithmus
   */
  it('works for wikipedia example', function () {
    var alignmentMatrix = seqal.alignmentMatrix('ACGTC', 'AGTC', simpleSimilarity, simpleGap);
    assert.deepEqual([
      [ 0, -1, -2, -3, -4 ],
      [ -1, 1, 0, -1, -2 ],
      [ -2, 0, 0, -1, 0 ],
      [ -3, -1, 1, 0, -1 ],
      [ -4, -2, 0, 2, 1 ],
      [ -5, -3, -1, 1, 3 ]
    ], alignmentMatrix.similarity);
    assert.deepEqual([
      [ '', '', '', '', '' ],
      [ '', 'D', 'L', 'L', 'L' ],
      [ '', 'T', 'D', 'D', 'D' ],
      [ '', 'T', 'D', 'L', 'T' ],
      [ '', 'T', 'T', 'D', 'L' ],
      [ '', 'T', 'T', 'T', 'D' ]
    ], alignmentMatrix.traceback);
  });


});

describe('alignmentArrayFromTraceback', function () {
  it('works for wikipedia example', function () {
    assert.deepEqual([
        ['A', 'C', 'G', 'T', 'C'],
        ['A', '', 'G', 'T', 'C']
      ],
      seqal.alignmentArrayFromTraceback('ACGTC', 'AGTC', [
          [ '', '', '', '', '' ],
          [ '', 'D', 'L', 'L', 'L' ],
          [ '', 'T', 'D', 'D', 'D' ],
          [ '', 'T', 'D', 'L', 'T' ],
          [ '', 'T', 'T', 'D', 'L' ],
          [ '', 'T', 'T', 'T', 'D' ]
        ]
      ));
  })
});

describe('alignmentFromTraceback', function () {
  it('works for wikipedia example', function () {
    assert.deepEqual([0, null, 1, 2, 3],
      seqal.alignmentFromTraceback('ACGTC', 'AGTC', [
          [ '', '', '', '', '' ],
          [ '', 'D', 'L', 'L', 'L' ],
          [ '', 'T', 'D', 'D', 'D' ],
          [ '', 'T', 'D', 'L', 'T' ],
          [ '', 'T', 'T', 'D', 'L' ],
          [ '', 'T', 'T', 'T', 'D' ]
        ]
      ));
  })
});

describe('align', function () {

  it('works for wikipedia example', function () {
    assert.deepEqual([0, null, 1, 2, 3],
      seqal.align('ACGTC', 'AGTC', simpleSimilarity, simpleGap));
  });

  it('works for wikipedia example in reverse order', function () {
    assert.deepEqual([0, 2, 3, 4],
      seqal.align('AGTC', 'ACGTC', simpleSimilarity, simpleGap));
  });

});

