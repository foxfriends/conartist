import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { expect } from 'chai';

import PricesListComponent from './prices-list.component';
import MaterialModule from '../material.module';
import StorageServiceMock, { StorageService } from '../data/storage.service.mock';
import { types, prices } from '../api/api.service.mock';

type ComponentContext = {
  fixture: ComponentFixture<PricesListComponent>;
  component: PricesListComponent;
};

type MethodContext = {
  component: PricesListComponent;
};

describe('Prices List Component', function() {
  describe('Component', function(this: Mocha.ISuiteCallbackContext & ComponentContext) {
    beforeEach('Configure the module', () => TestBed.configureTestingModule({
      imports: [ NoopAnimationsModule, MaterialModule, FormsModule ],
      declarations: [ PricesListComponent ],
      providers: [
        { provide: StorageService, useValue: StorageServiceMock },
      ],
    }));
    beforeEach('Create the component', () => {
      this.fixture = TestBed.createComponent(PricesListComponent);
      this.component = this.fixture.componentInstance;
      this.fixture.detectChanges();
    });
    it('should show a list of prices');
    it('should only show the prices for its type');
    it('should show prices for specific products separately');
    it('should react to changes in the stored data');
    describe('Rows', () => {
      it('should be editable');
      it('should be removable');
    })
  });

  describe('#setPricePrice', function(this: Mocha.ISuiteCallbackContext & MethodContext) {
    beforeEach('Create the component', () => this.component = new PricesListComponent(StorageServiceMock));
    beforeEach('Set the type for the component', () => this.component.type = types[0]);
    afterEach('Reset the storage service mock', () => StorageServiceMock.reset());
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
      StorageServiceMock.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.component.setPricePrice('10.50', 0, null);
      this.component.setPricePrice('14', 1, null);
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
      StorageServiceMock.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.component.setPricePrice('10.50', 0, 2);
      this.component.setPricePrice('14', 1, 2);
    });
    it('should accept prices prefixed with $', () => {
      this.component.setPricePrice('$10.50', 0, null);
      StorageServiceMock.prices.take(1).subscribe(_ => expect(_[0].prices[0][1]).to.equal(10.5));
    });
    it('should accept prices not prefixed with $', () => {
      this.component.setPricePrice('10.50', 0, null);
      StorageServiceMock.prices.take(1).subscribe(_ => expect(_[0].prices[0][1]).to.equal(10.5));
    });
    it('should round prices to the nearest cent', () => {
      this.component.setPricePrice('10.501', 0, null);
      StorageServiceMock.prices.take(1).subscribe(_ => expect(_[0].prices[0][1]).to.equal(10.5));
      this.component.setPricePrice('10.509', 0, null);
      StorageServiceMock.prices.take(1).subscribe(_ => expect(_[0].prices[0][1]).to.equal(10.51));
    });
  });

  describe('#setPriceQuantity', function(this: Mocha.ISuiteCallbackContext & MethodContext) {
    beforeEach('Create the component', () => this.component = new PricesListComponent(StorageServiceMock));
    beforeEach('Set the type for the component', () => this.component.type = types[0]);
    afterEach('Reset the storage service mock', () => StorageServiceMock.reset());
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
      StorageServiceMock.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.component.setPriceQuantity('15', 0, null);
      this.component.setPriceQuantity('30', 1, null);
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
      StorageServiceMock.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.component.setPriceQuantity('4', 0, 2);
      this.component.setPriceQuantity('5', 1, 2);
    });
  });

  describe('#removePriceRow', function(this: Mocha.ISuiteCallbackContext & MethodContext) {
    beforeEach('Create the component', () => this.component = new PricesListComponent(StorageServiceMock));
    beforeEach('Set the type for the component', () => this.component.type = types[0]);
    afterEach('Reset the storage service mock', () => StorageServiceMock.reset());
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
      StorageServiceMock.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.component.removePriceRow(1, null);
      this.component.removePriceRow(0, null);
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
      StorageServiceMock.prices.skip(1).take(2).subscribe(_ => gen.next(_));
      this.component.removePriceRow(1, 2);
      this.component.removePriceRow(0, 2);
    });
  });

  describe('#quantityIsNatural', function(this: Mocha.ISuiteCallbackContext & MethodContext) {
    beforeEach('Create the component', () => this.component = new PricesListComponent(StorageServiceMock));
    beforeEach('Set the type for the component', () => this.component.type = types[0]);
    afterEach('Reset the storage service mock', () => StorageServiceMock.reset());
    it('should return false for a non-number', () => expect(this.component.quantityIsNatural('five')).not.to.be.ok);
    it('should return false for negative number', () => expect(this.component.quantityIsNatural('-5')).not.to.be.ok);
    it('should return false for 0', () => expect(this.component.quantityIsNatural('0')).not.to.be.ok);
    it('should return true for a positive number', () => expect(this.component.quantityIsNatural('5')).to.be.ok);
    it('should return false for a non-integer', () => expect(this.component.quantityIsNatural('3.5')).not.to.be.ok);
  });

  describe('#priceIsPositive', function(this: Mocha.ISuiteCallbackContext & MethodContext) {
    beforeEach('Create the component', () => this.component = new PricesListComponent(StorageServiceMock));
    beforeEach('Set the type for the component', () => this.component.type = types[0]);
    afterEach('Reset the storage service mock', () => StorageServiceMock.reset());
    it('should return false for a non-number', () => expect(this.component.priceIsPositive('five')).not.to.be.ok);
    it('should return false for negative number', () => expect(this.component.priceIsPositive('-5')).not.to.be.ok);
    it('should return true for 0', () => expect(this.component.priceIsPositive('0')).to.be.ok);
    it('should return true for a positive number', () => expect(this.component.priceIsPositive('5')).to.be.ok);
    it('should return true for a non-integer', () => expect(this.component.priceIsPositive('3.5')).to.be.ok);
  });
});
