import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { expect } from 'chai';

import { ConDataSource } from './data-source';
import { products } from '../api/api.service.mock';

type Context = {
  dataSource: ConDataSource<ca.Product>;
};

describe('ca.Convention Data Source', function(this: Mocha.ISuiteCallbackContext & Context) {
  beforeEach('Create a data source', () => this.dataSource = new ConDataSource<ca.Product>(new BehaviorSubject(products)));
  describe('#connect', () => {
    it('should return an Observable', () => expect(this.dataSource.connect()).to.be.an.instanceof(Observable));
    it('should produce the entire data', () => {
      this.dataSource.connect().subscribe(_ => expect(_).to.deep.equal(products));
    });
  });
  describe('#filter', () => {
    it('should be applied to the data emitted by #connect', () => {
      const filter = (_: ca.Product) => _.id === 1;
      this.dataSource.filter = filter;
      this.dataSource.connect().subscribe(_ => expect(_).to.deep.equal(products.filter(filter)));
    });
    it('should cause #connect to re-emit when changed', done => {
      const filter1 = (_: ca.Product) => _.id === 1;
      const filter2 = (_: ca.Product) => _.id === 2;
      const gen = (function*(): any { // typescript why
        expect(yield).to.deep.equal(products);
        expect(yield).to.deep.equal(products.filter(filter1));
        expect(yield).to.deep.equal(products.filter(filter2));
        done();
      })();
      gen.next();
      this.dataSource.connect().subscribe(_ => gen.next(_));
      this.dataSource.filter = filter1;
      this.dataSource.filter = filter2;
    });
  });
  describe('#sort', () => {
    it('should be applied to the data emitted by #connect', () => {
      const sort = (a: ca.Product, b: ca.Product) => a.id - b.id;
      this.dataSource.sort = sort;
      this.dataSource.connect().subscribe(_ => expect(_).to.deep.equal(products.slice().sort(sort)));
    });
    it('should cause #connect to re-emit when changed', done => {
      const sort1 = (a: ca.Product, b: ca.Product) => a.id - b.id;
      const sort2 = (a: ca.Product, b: ca.Product) => b.id - a.id;
      const gen = (function*(): any { // typescript why
        expect(yield).to.deep.equal(products);
        expect(yield).to.deep.equal(products.slice().sort(sort1));
        expect(yield).to.deep.equal(products.slice().sort(sort2));
        done();
      })();
      gen.next();
      this.dataSource.connect().subscribe(_ => gen.next(_));
      this.dataSource.sort = sort1;
      this.dataSource.sort = sort2;
    });
  });
});
