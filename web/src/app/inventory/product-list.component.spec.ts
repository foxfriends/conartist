import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { expect } from 'chai';

import ProductListComponent from './product-list.component';
import MaterialModule from '../material.module';
import StorageServiceMock, { StorageService } from '../data/storage.service.mock';
import { types, products } from '../api/api.service.mock';

type ComponentContext = {
  fixture: ComponentFixture<ProductListComponent>;
  component: ProductListComponent;
};

type MethodContext = {
  component: ProductListComponent;
};

describe('Product List Component', function() {
  describe('Component', function(this: Mocha.ISuiteCallbackContext & ComponentContext) {
    beforeEach('Configure the module', () => TestBed.configureTestingModule({
      imports: [ NoopAnimationsModule, MaterialModule, FormsModule ],
      declarations: [ ProductListComponent ],
      providers: [
        { provide: StorageService, useValue: StorageServiceMock },
      ],
    }));
    beforeEach('Create the component', () => {
      this.fixture = TestBed.createComponent(ProductListComponent);
      this.component = this.fixture.componentInstance;
      this.fixture.detectChanges();
    });
    it('should show a list of products');
    it('should only show the products for its type');
    it('should not show discontinued products when showDiscontinued is false');
    it('should show discontinued products when showDiscontinued is true');
    it('should react to changes in the stored data');
    it('should add another product when the button is pressed');
    describe('Rows', () => {
      it('should be editable');
      it('should be removable');
      it('should be able to add price rows for the product');
    })
  });

  describe('#productNameIsUnique', function(this: Mocha.ISuiteCallbackContext & MethodContext) {
    beforeEach('Create the component', () => this.component = new ProductListComponent(StorageServiceMock));
    beforeEach('Set the type for the component', () => this.component.type = types[0]);
    afterEach('Reset the storage service mock', () => StorageServiceMock.reset());
    it('should return true for a unique product name', () => expect(this.component.productNameIsUnique('unique-name')).to.be.ok);
    it('should return false for a not unique product name', () => expect(this.component.productNameIsUnique(products[0].name)).not.to.be.ok);
  });

  describe('#quantityIsNatural', function(this: Mocha.ISuiteCallbackContext & MethodContext) {
    beforeEach('Create the component', () => this.component = new ProductListComponent(StorageServiceMock));
    beforeEach('Set the type for the component', () => this.component.type = types[0]);
    afterEach('Reset the storage service mock', () => StorageServiceMock.reset());
    it('should return false for a non-number', () => expect(this.component.quantityIsNatural('five')).not.to.be.ok);
    it('should return false for negative number', () => expect(this.component.quantityIsNatural('-5')).not.to.be.ok);
    it('should return false for 0', () => expect(this.component.quantityIsNatural('0')).to.be.ok);
    it('should return true for a positive number', () => expect(this.component.quantityIsNatural('5')).to.be.ok);
    it('should return false for a non-integer', () => expect(this.component.quantityIsNatural('3.5')).not.to.be.ok);
  });
});
