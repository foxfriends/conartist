import { expect } from 'chai';

import { Deferred } from './deferred';

describe('Deferred', function() {
  const theValue = Symbol();
  it('should be and act like a promise', () => {
    const def = new Deferred((resolve, reject) => {
      expect(resolve).to.be.a('function');
      expect(reject).to.be.a('function');
      resolve(theValue);
    });
    expect(def).to.be.an.instanceof(Promise);
    return expect(def).to.eventually.equal(theValue);
  });

  it('should resolve when the resolve method is called', () => {
    const def = new Deferred();
    def.resolve(theValue);
    return expect(def).to.eventually.equal(theValue);
  });

  it('should reject when the reject method is called', () => {
    const def = new Deferred();
    def.reject(theValue);
    return expect(def).to.eventually.be.rejectedWith(theValue);
  });

  it('should be properly thennable when returning a value', () => {
    const def = new Deferred();
    const then = def.then(() => theValue);
    def.resolve();
    expect(then).to.eventually.equal(theValue);
  });

  it('should be properly thennable when returning a promise', () => {
    const def = new Deferred();
    const then = def.then(() => Promise.resolve(theValue));
    def.resolve();
    expect(then).to.eventually.equal(theValue);
  });
});
