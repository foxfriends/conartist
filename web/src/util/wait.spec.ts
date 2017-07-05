import { expect } from 'chai';
import wait, { ResRej } from './wait';
import * as lolex from 'lolex';

type Context = {
  clock: lolex.Clock;
};

describe('Wait', function(this: Mocha.ISuiteCallbackContext & Context) {
  before('Install the clock', () => this.clock = lolex.install());
  after('Uninstall the clock', () => this.clock.uninstall());

  it('should resolve after the time has passed', done => {
    expect(wait(1000)).to.eventually.be.fulfilled.notify(done);;
    this.clock.tick(1000);
  });
  it('should call the provided callback instead of resolving', done => {
    expect(wait(1000, () => done())).not.to.eventually.be.fulfilled;
    this.clock.tick(1000);
  });
  it('should pass the resolver functions to the provided callback', done => {
    let called = 0;
    function collect() { if(called++) done(); }
    expect(wait(1000, (resolve: ResRej<void>) => resolve())).to.eventually.be.fulfilled.notify(collect);
    expect(wait(1000, (_: ResRej<void>, reject: ResRej<void>) => reject())).to.eventually.be.rejected.notify(collect);
    this.clock.tick(1000);
  });
  describe("#cancel", () => {
    it('should reject the promise', () => expect(wait(1000).cancel()).to.eventually.be.rejected);
  });
  describe("#skip", () => {
    it('should immediately resolve the promise', () => expect(wait(1000).skip()).to.eventually.be.fulfilled);
  });
  describe("#reset", () => {
    it('should restart the timer', () => {
      let fulfilled = false;
      const w = wait<void>(1000, (resolve) => (fulfilled = true, resolve()));
      this.clock.tick(500);
      w.reset();
      this.clock.tick(500);
      expect(fulfilled).not.to.be.ok;
      this.clock.tick(500);
      return expect(w).to.eventually.be.fulfilled;
    });
  });
});
