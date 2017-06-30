import { expect } from 'chai';

import TypePipe from './type.pipe';
import { types } from '../api/api.service.mock';
import StorageServiceMock from './storage.service.mock';

import { ProductType } from '../../../../conartist';

type Context = {
  pipe: TypePipe;
};

describe('Type Pipe', function(this: Mocha.ISuiteCallbackContext & Context) {
  beforeEach('Instantiate the pipe', () => this.pipe = new TypePipe(StorageServiceMock));

  it('should transform a type id to the corresponding type', () => {
    expect(this.pipe.transform(0)).to.deep.equal(types.find(_ => _.id === 0));
  });
  it('should transform a missing type id to an unknown type object', () => {
    expect(this.pipe.transform(-1)).to.deep.equal({ name: 'Unknown Type', id: -1, color: 0xFFFFFF, discontinued: false });
  });
  const keys: (keyof ProductType)[] = [ 'name', 'id', 'color', 'discontinued' ];
  keys.forEach(key =>
    it(`should transform a type id to the ${key} property of the corresponding type`, () =>
      expect(this.pipe.transform(0, key)).to.deep.equal(types.find(_ => _.id === 0)![key])
    )
  );
});
