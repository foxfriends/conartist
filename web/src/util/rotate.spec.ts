import { expect } from 'chai';
import rotate from './rotate';

describe('Rotate', function() {
  it('should return a square array rotated', () => {
    expect(rotate([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ])).to.deep.equal([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
  });
});
