import { expect } from 'chai';
import Wrappable from './wrappable';

describe('Wrappable', function() {
  const wrapped = Wrappable([1, 2, 3, 4]);

  it('should be like a regular array', () => {
    expect(wrapped).to.deep.equal([1, 2, 3, 4]);
    expect(wrapped.map(_ => _ * 2)).to.deep.equal([2, 4, 6, 8]);
  });

  it('should return from the back of the array with negative indices', () => {
    expect(wrapped[-1]).to.equal(4);
    expect(wrapped[-2]).to.equal(3);
    expect(wrapped[-3]).to.equal(2);
    expect(wrapped[-4]).to.equal(1);
  });

  it('should return from the start of the array past the last index', () => {
    expect(wrapped[4]).to.equal(1);
    expect(wrapped[5]).to.equal(2);
    expect(wrapped[6]).to.equal(3);
    expect(wrapped[7]).to.equal(4);
  });

  it('should work for arbitrarily large indices', () => {
    expect(wrapped[400]).to.equal(1);
    expect(wrapped[-300]).to.equal(1);
  });
});
