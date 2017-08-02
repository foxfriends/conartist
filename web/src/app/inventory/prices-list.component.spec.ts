import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { expect } from 'chai';
import { spy } from 'sinon';

import { PricesListComponent } from './prices-list.component';
import { MaterialModule } from '../material.module';
import { StorageServiceMock, StorageService } from '../data/storage.service.mock';
import { types } from '../api/api.service.mock';

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
    it('should add another row to the type\'s prices when the button is pressed')
    it('should not show prices for discontinued products when showDiscontinued is false')
    it('should show prices ofr discontinued products when showDiscontinued is true')
    describe('Rows', () => {
      it('should be editable');
      it('should be removable');
    })
  });

  describe('#setPricePrice', function(this: Mocha.ISuiteCallbackContext & MethodContext) {
    beforeEach('Create the component', () => this.component = new PricesListComponent(StorageServiceMock));
    beforeEach('Set the type for the component', () => this.component.type = types[0]);
    afterEach('Reset the storage service mock', () => StorageServiceMock.reset());
    it('should call StorageService#setPricePrice', () => {
      const setPricePrice = spy(StorageServiceMock, 'setPricePrice');
      this.component.setPricePrice('$10.50', 0);
      expect(setPricePrice).to.have.been.calledWith(0, 10.5);
      setPricePrice.restore();
    });
    it('should accept prices prefixed with $', () => {
      this.component.setPricePrice('$10.50', 0);
      StorageServiceMock.prices.take(1).subscribe(_ => expect(_[0].price).to.equal(10.5));
    });
    it('should accept prices not prefixed with $', () => {
      this.component.setPricePrice('10.50', 0);
      StorageServiceMock.prices.take(1).subscribe(_ => expect(_[0].price).to.equal(10.5));
    });
  })

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
