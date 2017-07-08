import { inject, TestBed } from '@angular/core/testing';
import { MdSnackBar } from '@angular/material';
import { expect } from 'chai';
import { spy, SinonSpy as Spy } from 'sinon';
import StorageService from './storage.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';

import APIServiceMock, { validConCode, conventions, prices, products, types, fullConventions, userInfo } from '../api/api.service.mock';
import MaterialModule from '../material.module';
import ErrorServiceMock, { ErrorService } from '../modals/error.service.mock';
import { UserInfo, MetaConvention } from '../../../../conartist';

type Context = {
  service: StorageService;
  getUserInfo: Spy;
  loadConvention: Spy;
};

describe('Storage Service', function(this: Mocha.ISuiteCallbackContext & Context) {
  // TODO: Mock the modules manually so the TestBed is not required
  beforeEach('Configure testing module', () => TestBed.configureTestingModule({
    imports: [ MaterialModule ],
    providers: [
      { provide: ErrorService, useValue: ErrorServiceMock }
    ]
  }));

  before('Spy on the APIService#getUserInfo', () => this.getUserInfo = spy(APIServiceMock, 'getUserInfo'));
  before('Spy on the APIService#loadConvention', () => this.loadConvention = spy(APIServiceMock, 'loadConvention'));
  afterEach('Reset the APIService#getUserInfo spy', () => this.getUserInfo.reset());
  afterEach('Reset the APIService#loadConvention spy', () => this.loadConvention.reset());
  after('Un-spy on the APIService#getUSerInfo', () => this.getUserInfo.restore());
  after('Un-spy on the APIService#loadConvention', () => this.loadConvention.restore());

  beforeEach('Create a new Storage service', inject([MdSnackBar, ErrorService],
    (snackbar: MdSnackBar, error: ErrorService) => this.service = new StorageService(APIServiceMock, snackbar, error)
  ));

  const tests: (keyof UserInfo)[] = ['email', 'keys', 'products', 'prices', 'types', 'conventions'];

  it('should request the initial user info on start', () => {
    expect(APIServiceMock.getUserInfo).to.have.been.calledOnce;
  });

  tests.forEach((prop: keyof UserInfo) =>
    describe(`#${prop}`, () => {
      it('should be a BehaviorSubject', () => expect(this.service[prop]).to.be.an.instanceOf(BehaviorSubject));
    })
  );

  describe('#convention', () => {
    it('should be an Observable', () => expect(this.service.convention(validConCode)).to.be.an.instanceOf(Observable));
  });

  describe('#updateConvention', () => {
    it('should cause #convention to emit an event with the filled convention', done => {
      const gen = (function*(): any { // typescript why
        expect(yield).to.deep.equal({ ...conventions.find(_ => _.code === validConCode) });
        expect(yield).to.deep.equal({ ...fullConventions.find(_ => _.code === validConCode), dirty: true });
        done();
      })();
      gen.next();
      this.service.convention(validConCode).take(2).subscribe(_ => gen.next(_));
      this.service.updateConvention(fullConventions.find(_ => _.code === validConCode)!);
    });
    it('should cause #conventions to emit an event including the filled convention', done => {
      const gen = (function*(): any { // typescript why
        expect(yield).to.deep.equal(conventions);
        expect(yield).to.deep.equal(conventions.map(_ => _.code === validConCode ? { ...fullConventions.find(_ => _.code === validConCode), dirty: true } : _));
        done();
      })();
      gen.next();
      this.service.conventions.take(2).subscribe(_ => gen.next(_));
      this.service.updateConvention(fullConventions.find(_ => _.code === validConCode)!);
    });
  });

  describe('#addConvention', () => {
    it('should add a convention to the convention list', () => {
      const convention: MetaConvention = {
        type: 'meta' as 'meta',
        title: 'title',
        code: 'labne',
        start: new Date(0),
        end: new Date(30000),
      };
      this.service.addConvention(convention);
      this.service.conventions.subscribe(_ => expect(_).to.deep.equal([...conventions, { ...convention, dirty: true }]));
    });
    it('should not work if the convention is already added', () => {
      const convention = conventions[0];
      expect(() => this.service.addConvention(convention)).to.throw(Error, convention.title);
    });
    it('should not work if there are no keys', () => {
      this.service.keys.next(0);
      const convention = conventions[0];
      expect(() => this.service.addConvention(convention)).to.throw(Error, 'keys');
    });
    it('should remove a key when successful', () => {
      const convention: MetaConvention = {
        type: 'meta' as 'meta',
        title: 'title',
        code: 'labne',
        start: new Date(0),
        end: new Date(30000),
      };
      this.service.addConvention(convention);
      this.service.keys.subscribe(_ => expect(_).to.equal(userInfo.keys - 1))
    });
    it('should not remove a key when unsuccessful', () => {
      const convention = conventions[0];
      expect(() => this.service.addConvention(convention)).to.throw(Error, convention.title);
      this.service.keys.subscribe(_ => expect(_).to.equal(userInfo.keys))
    });
  });

  describe('#removeConvention', () => {
    it('should remove the convention from the list', () => {
      const code = 'xyzab';
      this.service.removeConvention(code);
      this.service.conventions.subscribe(_ => expect(_).to.deep.equal(
        [
          { type: 'invalid', code, dirty: true },
          ...conventions.slice(1),
        ]
      ));
    });
    it('should add a key when a convention is removed', () => {
      const code = 'xyzab';
      this.service.removeConvention(code);
      this.service.keys.subscribe(_ => expect(_).to.equal(userInfo.keys + 1))
    });
    it('should not add a key when a convention is not removed', () => {
      const code = '-----';
      this.service.removeConvention(code);
      this.service.keys.subscribe(_ => expect(_).to.equal(userInfo.keys))
    });
  });

  describe('#addConventionProduct', () => {
    it('should add a product to the convention');
    it('should add a product that was previously removed to the convention');
    it('should reset a product that was already added to the convention');
    it('should cause #convention to emit an event with the updated convention');
    it('should cause #conventions to emit an event with the updated convention');
  });
  describe('#removeConventionProduct', () => {
    it('should remove a product from the convention');
    it('should do nothing when a product is not added to the convention');
    it('should cause #convention to emit an event with the updated convention');
    it('should cause #conventions to emit an event with the updated convention');
  });

  describe('#fillConvention', () => {
    it('should call the API when the requested convention is not filled', () => {
      this.service.fillConvention(validConCode);
      expect(this.loadConvention, 'the API should only be accessed once').to.have.been.calledOnce;
      expect(this.loadConvention, 'the right con code should be passed to the API').to.have.been.calledWith(validConCode);
    });
    it('should cause #convention to emit an event with the filled convention', done => {
      const gen = (function*(): any { // typescript why
        expect(yield).to.deep.equal(conventions.find(_ => _.code === validConCode));
        expect(yield).to.deep.equal(fullConventions.find(_ => _.code === validConCode));
        done();
      })();
      gen.next();
      this.service.convention(validConCode).take(2).subscribe(_ => gen.next(_));
      this.service.fillConvention(validConCode);
    });
    it('should cause #conventions to emit an event including the filled convention', done => {
      const gen = (function*(): any { // typescript why
        expect(yield).to.deep.equal(conventions);
        expect(yield).to.deep.equal(conventions.map(_ => _.code === validConCode ? fullConventions.find(_ => _.code === validConCode) : _));
        done();
      })();
      gen.next();
      this.service.conventions.take(2).subscribe(_ => gen.next(_));
      this.service.fillConvention(validConCode);
    });
    it('should not call the API when the convention is already filled', done => {
      this.service.fillConvention(validConCode);
      this.service.convention(validConCode).subscribe(
        () => {
          this.service.fillConvention(validConCode);
          expect(this.loadConvention, 'the API should only be accessed the first time').to.have.been.calledOnce;
          expect(this.loadConvention, 'the right con code should be passed to the API').to.have.been.calledWith(validConCode);
          done();
        }
      );
    });
  });

  describe('#createProduct', () => {
    it('should add a new product to the list', () => {
      const type = types[0];
      const index = 4;
      this.service.createProduct(type, index);
      this.service.products.subscribe(_ => expect(_).to.deep.equal(
        [...products, {
          name: `${type.name} ${index}`,
          quantity: 0,
          type: type.id,
          id: -index,
          discontinued: false
        }]
      ))
    });
    it('should avoid name collisions');
  });

  describe('#setProductName', () => {
    it('should set the name for the product', () => {
      this.service.setProductName(1, 'new-product-name');
      this.service.products.subscribe(_ => expect(_).to.deep.equal([
        { ...products[0], name: 'new-product-name', dirty: true },
        ...products.slice(1)
      ]));
    });
    it('should not allow duplicate names');
  });

  describe('#setProductQuantity', () => {
    it('should set the quantity for the product', () => {
      this.service.setProductQuantity(1, 18);
      this.service.products.subscribe(_ => expect(_).to.deep.equal([
        { ...products[0], quantity: 18, dirty: true },
        ...products.slice(1)
      ]));
    });
  });

  describe('#setProductDiscontinued', () => {
    it('should set discontinued for the product', () => {
      this.service.setProductDiscontinued(1, true);
      this.service.products.subscribe(_ => expect(_).to.deep.equal([
        { ...products[0], discontinued: true, dirty: true },
        ...products.slice(1)
      ]));
    });

    it('should remove the product entirely if it has not been committed', () => {
      const type = types[0], index = 4;
      this.service.createProduct(type, index);
      this.service.setProductDiscontinued(-index, true);
      this.service.products.subscribe(_ => expect(_).to.deep.equal(products));
    });
  });

  describe('#createType', () => {
    it('should add the type to the list');
    it('should avoid name collisions');
  });
  describe('#setTypeName', () => {
    it('should set the name for the type');
    it('should not allow duplicate names');
  });
  describe('#setTypeDiscontinued', () => {
    it('should set discontinued for the type');
  });
  describe('#setTypeColor', () => {
    it('should set the color for the type');
  });

  describe('#setPricePrice', () => {
    it('should set the price for the row [type]', done => {
      const gen = (function*(): any { // typescript why
        expect(yield, 'the first row should change').to.deep.equal([
          { ...prices[0], prices: [[3, 10.5], [1, 5]], dirty: true },
          ...prices.slice(1),
        ]);
        expect(yield, 'the second row should change').to.deep.equal([
          { ...prices[0], prices: [[3, 10.5], [1, 14]], dirty: true },
          ...prices.slice(1),
        ]);
        done();
      })();
      gen.next();
      this.service.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.service.setPricePrice(1, null, 0, 10.50);
      this.service.setPricePrice(1, null, 1, 14);
    });
    it('should set the price for the row [product]', done => {
      const gen = (function*(): any { // typescript why
        expect(yield, 'the first row should change').to.deep.equal([
          prices[0],
          { ...prices[1], prices: [[1, 10.5], [2, 8]], dirty: true },
          ...prices.slice(2),
        ]);
        expect(yield, 'the second row should change').to.deep.equal([
          prices[0],
          { ...prices[1], prices: [[1, 10.5], [2, 14]], dirty: true },
          ...prices.slice(2),
        ]);
        done();
      })();
      gen.next();
      this.service.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.service.setPricePrice(1, 2, 0, 10.50);
      this.service.setPricePrice(1, 2, 1, 14);
    });
    it('should round prices to the nearest cent', () => {
      this.service.setPricePrice(1, null, 0, 10.501);
      this.service.prices.take(1).subscribe(_ => expect(_[0].prices[0][1]).to.equal(10.5));
      this.service.setPricePrice(1, null, 0, 10.509);
      this.service.prices.take(1).subscribe(_ => expect(_[0].prices[0][1]).to.equal(10.51));
    });
  });

  describe('#setPriceQuantity', () => {
    it('should set the quantity for the row [type]', done => {
      const gen = (function*(): any { // typescript why
        expect(yield, 'the first row should change').to.deep.equal([
          { ...prices[0], prices: [[15, 10], [1, 5]], dirty: true },
          ...prices.slice(1),
        ]);
        expect(yield, 'the second row should change').to.deep.equal([
          { ...prices[0], prices: [[15, 10], [30, 5]], dirty: true },
          ...prices.slice(1),
        ]);
        done();
      })();
      gen.next();
      this.service.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.service.setPriceQuantity(1, null, 0, 15);
      this.service.setPriceQuantity(1, null, 1, 30);
    });
    it('should set the quantity for the row [product]', done => {
      const gen = (function*(): any { // typescript why
        expect(yield, 'the first row should change').to.deep.equal([
          prices[0],
          { ...prices[1], prices: [[4, 7], [2, 8]], dirty: true },
          ...prices.slice(2),
        ]);
        expect(yield, 'the second row should change').to.deep.equal([
          prices[0],
          { ...prices[1], prices: [[4, 7], [5, 8]], dirty: true },
          ...prices.slice(2),
        ]);
        done();
      })();
      gen.next();
      this.service.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.service.setPriceQuantity(1, 2, 0, 4);
      this.service.setPriceQuantity(1, 2, 1, 5);
    });
  });

  describe('#addPriceRow', () => {
    it('should add a row to the prices listing [type]');
    it('should add a row to the prices listing [product]');
    it('should create a new price listing [type]');
    it('should create a new price listing [product]');
  });

  describe('#removePriceRow', () => {
    it('should remove the row from the price listing [type]', done => {
      const gen = (function*(): any { // typescript why
        expect(yield, 'the second row should be removed').to.deep.equal([
          { ...prices[0], prices: [[3, 10]], dirty: true },
          ...prices.slice(1),
        ]);
        expect(yield, 'the first row should be removed').to.deep.equal([
          { ...prices[0], prices: [], dirty: true },
          ...prices.slice(1),
        ]);
        done();
      })();
      gen.next();
      this.service.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.service.removePriceRow(1, null, 1);
      this.service.removePriceRow(1, null, 0);
    });
    it('should remove the row from the price listing [product]', done => {
      const gen = (function*(): any { // typescript why
        expect(yield, 'the second row should be removed').to.deep.equal([
          prices[0],
          { ...prices[1], prices: [[1, 7]], dirty: true },
          ...prices.slice(2),
        ]);
        expect(yield, 'the first row should be removed').to.deep.equal([
          prices[0],
          { ...prices[1], prices: [], dirty: true },
          ...prices.slice(2),
        ]);
        done();
      })();
      gen.next();
      this.service.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.service.removePriceRow(1, 2, 1);
      this.service.removePriceRow(1, 2, 0);
    });
  });

  describe('#commit', () => {
    it('should attempt to save product types');
    it('should attempt to save products');
    it('should attempt to save products based on newly committed types');
    it('should attempt to save prices');
    it('should attempt to save prices based on newly committed types and products');
    it('should attempt to save conventions');
    it('should attempt to save conventions based on newly committed products and prices');
    it('should emit the committed values');
    it('should perform a rollback on failure when requested');
    it('should perform a partial rollback when parts failed to be saved');
  });
});
