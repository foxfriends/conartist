import { inject, TestBed } from '@angular/core/testing';
import { MdSnackBar } from '@angular/material';
import { expect } from 'chai';
import { spy, SinonSpy as Spy } from 'sinon';
import { StorageService } from './storage.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';

import { APIServiceMock, validConCode, conventions, products, types, fullConventions, userInfo, simplePrices } from '../api/api.service.mock';
import { MaterialModule } from '../material.module';
import { BroadcastModule } from '../broadcast/broadcast.module';
import { BroadcastService } from '../broadcast/broadcast.service';
import { SignInEvent } from '../broadcast/event';
import { ErrorServiceMock, ErrorService } from '../modals/error.service.mock';

type Context = {
  service: StorageService;
  getUserInfo: Spy;
  loadConvention: Spy;
};

describe('Storage Service', function(this: Mocha.ISuiteCallbackContext & Context) {
  // TODO: Mock the modules manually so the TestBed is not required
  beforeEach('Configure testing module', () => TestBed.configureTestingModule({
    imports: [ MaterialModule, BroadcastModule ],
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

  beforeEach('Create a new Storage service', inject([MdSnackBar, ErrorService, BroadcastService],
    (snackbar: MdSnackBar, error: ErrorService, broadcast: BroadcastService) => {
      this.service = new StorageService(APIServiceMock, snackbar, error, broadcast);
      broadcast.emit(new SignInEvent);
    }
  ));

  const tests: (keyof ca.UserInfo)[] = ['email', 'keys', 'products', 'prices', 'types', 'conventions'];

  it('should request the initial user info on log in', () => {
    expect(APIServiceMock.getUserInfo).to.have.been.calledOnce;
  });

  tests.forEach((prop: keyof ca.UserInfo) =>
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
      const convention: ca.MetaConvention = {
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
      const convention: ca.MetaConvention = {
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
    it('should call the API when the requested convention is not filled', async () => {
      await this.service.fillConvention(validConCode);
      expect(this.loadConvention, 'the API should be called').to.have.been.calledOnce;
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
      this.service.convention(validConCode).filter(_ => _.type === 'full').subscribe(
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
      const index = products.length + 1;
      this.service.createProduct(type);
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
      const type = types[0];
      this.service.createProduct(type);
      this.service.setProductDiscontinued(-products.length - 1, true);
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
    it('should set the price for the row', done => {
      const gen = (function*(): any { // typescript why
        expect(yield, 'the first row should change').to.deep.equal([
          { ...simplePrices[0], price: 10.5, dirty: true },
          ...simplePrices.slice(1),
        ]);
        expect(yield, 'the second row should change').to.deep.equal([
          { ...simplePrices[0], price: 10.5, dirty: true },
          { ...simplePrices[1], price: 14, dirty: true },
          ...simplePrices.slice(2),
        ]);
        done();
      })();
      gen.next();
      this.service.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.service.setPricePrice(0, 10.50);
      this.service.setPricePrice(1, 14);
    });
    it('should not use the actual array index', () => {
      this.service.setPricePrice(7, 15);
      this.service.prices.take(1).subscribe(_ => expect(_[4].price).to.equal(15));
    });
    it('should round prices to the nearest cent', () => {
      this.service.setPricePrice(0, 10.501);
      this.service.prices.take(1).subscribe(_ => expect(_[0].price).to.equal(10.5));
      this.service.setPricePrice(0, 10.509);
      this.service.prices.take(1).subscribe(_ => expect(_[0].price).to.equal(10.51));
    });
  });

  describe('#setPriceQuantity', () => {
    it('should set the quantity for the row', done => {
      const gen = (function*(): any { // typescript why
        expect(yield, 'the first row should change').to.deep.equal([
          { ...simplePrices[0], quantity: 15, dirty: true },
          ...simplePrices.slice(1),
        ]);
        expect(yield, 'the second row should change').to.deep.equal([
          { ...simplePrices[0], quantity: 15, dirty: true },
          { ...simplePrices[1], quantity: 30, dirty: true },
          ...simplePrices.slice(2),
        ]);
        done();
      })();
      gen.next();
      this.service.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.service.setPriceQuantity(0, 15);
      this.service.setPriceQuantity(1, 30);
    });
    it('should not use the actual array index', () => {
      this.service.setPriceQuantity(7, 15);
      this.service.prices.take(1).subscribe(_ => expect(_[4].quantity).to.equal(15));
    });
  });

  describe('#addPriceRow', () => {
    it('should create a new price listing', () => {
      this.service.addPriceRow(0, 3);
      this.service.prices.take(1).subscribe(prices => {
        expect(prices.length).to.equal(6);
        expect(prices[5]).to.deep.equal({ index: 6, type: 0, product: 3, price: 0, quantity: 1, dirty: true });
      });
    });
    it('should accept an initial price and quantity', () => {
      this.service.addPriceRow(0, 3, 4, 5);
      this.service.prices.take(1).subscribe(prices => {
        expect(prices.length).to.equal(6);
        expect(prices[5]).to.deep.equal({ index: 6, type: 0, product: 3, price: 5, quantity: 4, dirty: true });
      });
    });
  });

  describe('#removePriceRow', () => {
    it('should remove the row from the price listing', done => {
      const gen = (function*(): any { // typescript why
        expect(yield, 'the first row should be removed').to.deep.equal([
          { ...simplePrices[0], price: -1, dirty: true },
          ...simplePrices.slice(1),
        ]);
        expect(yield, 'the second row should be removed').to.deep.equal([
          { ...simplePrices[0], price: -1, dirty: true },
          { ...simplePrices[1], price: -1, dirty: true },
          ...simplePrices.slice(2),
        ]);
        done();
      })();
      gen.next();
      this.service.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.service.removePriceRow(0);
      this.service.removePriceRow(1);
    });
    it('should not use the actual array index', () => {
      this.service.removePriceRow(7);
      this.service.prices.take(1).subscribe(_ => expect(_).to.deep.equal([
        ...simplePrices.slice(0, 4),
        { ...simplePrices[4], price: -1, dirty: true },
      ]));
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

  describe('#reset', () => {
    it('should set each property to its default state');
  });

  describe('#discard', () => {
    it('should set each property back to the first loaded value');
    it('should set each property back to the state after the most recent commit');
  });
});
