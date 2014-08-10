function filledArray(len, val) {
  var rv = new Array(len);
  while (--len >= 0) {
    rv[len] = val;
  }
  return rv;
}

/**
 *
 * @param a sequence a
 * @param b sequence a
 * @param w Similarity-Score-Function
 * @param f Gap-Cost-Function
 * @returns {*[]}
 */
function alignmentMatrix(a, b, w, f) {
  var m = [];
  var t = [];

  for (var i = 0; i <= a.length; i++) {
    m.push([f(i)].concat(filledArray(b.length)));
    t.push(filledArray(b.length + 1, ''));
  }
  for (var j = 0; j <= b.length; j++) {
    m[0][j] = f(j);
  }

  for (var i = 1; i <= a.length; i++) {
    for (var j = 1; j <= b.length; j++) {
      var valDiagonal = m[i - 1][j - 1] + w(a[i - 1], b[j - 1]);
      var valTop = m[i - 1][j] + f(1);  // Deletion
      var valLeft = m[i][j - 1] + f(1); // Insertion
      var maxVal, direction;
      if (valDiagonal >= valTop && valDiagonal >= valLeft) {
        maxVal = valDiagonal;
        direction = 'D';
      } else if (valTop >= valDiagonal && valTop >= valLeft) {
        maxVal = valTop;
        direction = 'T';
      } else {
        maxVal = valLeft;
        direction = 'L';
      }
      m[i][j] = maxVal;
      t[i][j] = direction;
    }
  }
  return {
    similarity: m,
    traceback: t
  };
};

function alignmentArrayFromTraceback(a, b, t) {
  var aAlignment = [];
  var bAlignment = [];
  var i = a.length;
  var j = b.length;
  while (i > 0 && j > 0) {
    switch (t[i][j]) {
      case 'D':
        aAlignment.push(a[i - 1]);
        bAlignment.push(b[j - 1]);
        i = i - 1;
        j = j - 1;
        break;
      case 'T':
        aAlignment.push(a[i - 1]);
        bAlignment.push('');
        i = i - 1;
        break;
      case 'L':
        aAlignment.push('');
        bAlignment.push(b[j - 1]);
        j = j - 1;
        break
    }

  }
  return [aAlignment.reverse(), bAlignment.reverse()]
};


function alignmentFromTraceback(a, b, t) {
  var alignment = [];
  var i = a.length;
  var j = b.length;
  while (i > 0 && j > 0) {
    switch (t[i][j]) {
      case 'D':
        alignment[i - 1] = j - 1;
        i = i - 1;
        j = j - 1;
        break;
      case 'T':
        alignment[i - 1] = null;
        i = i - 1;
        break;
      case 'L':
        j = j - 1;
        break
    }

  }
  return alignment;
};

exports.align = function (a, b, w, f) {
  var alignMatrix = alignmentMatrix(a, b, w, f);
  return alignmentFromTraceback(a, b, alignMatrix.traceback);
};

exports.alignmentArrayFromTraceback = alignmentArrayFromTraceback;
exports.alignmentMatrix = alignmentMatrix;
exports.alignmentFromTraceback = alignmentFromTraceback;