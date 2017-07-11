import { expect } from 'chai';

import ProductPipe from './product.pipe';
import { products } from '../api/api.service.mock';
import StorageServiceMock from './storage.service.mock';

import { Product } from '../../../../conartist';

type Context = {
  pipe: ProductPipe;
};

describe('Product Pipe', function(this: Mocha.ISuiteCallbackContext & Context) {
  beforeEach('Instantiate the pipe', () => this.pipe = new ProductPipe(StorageServiceMock));

  it('should transform a product id to the corresponding product', () => {
    expect(this.pipe.transform(1)).to.deep.equal(products.find(_ => _.id === 1));
  });
  it('should transform a missing product id to an unknown product object', () => {
    expect(this.pipe.transform(-1)).to.deep.equal({ name: '', type: -1, id: -1, quantity: 0, discontinued: false });
  });
  const keys: (keyof Product)[] = [ 'name', 'quantity', 'id', 'type', 'discontinued' ];
  keys.forEach(key =>
    it(`should transform a product id to the ${key} property of the corresponding product`, () => {
      const product = products.find(_ => _.id === 1);
      if(product) {
        expect(this.pipe.transform(1, key)).to.deep.equal(product[key])
      } else {
        expect.fail('The product being used for this test doesn\'t exist!');
      }
    })
  );
});
