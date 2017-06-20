import { expect } from 'chai';
import { spy, SinonSpy as Spy } from 'sinon';
import StorageService from './storage.service';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';

import APIServiceMock, { newUser, userInfo } from '../api/api.service.mock';
import { UserInfo } from '../../../../conartist';

type Context = {
  service: StorageService;
  getUserInfo: Spy;
};

describe('Storage Service', function(this: Mocha.ISuiteCallbackContext & Context) {
  before('Spy on the APIService#getUserInfo', () => this.getUserInfo = spy(APIServiceMock, 'getUserInfo'));
  after('Reset the APIService#getUserInfo spy', () => this.getUserInfo.reset());
  after('Un-spy on the APIService#getUSerInfo', () => this.getUserInfo.restore());

  beforeEach('Create a new Storage service', () => this.service = new StorageService(APIServiceMock));

  const tests = [
    ['email', newUser.email],
    ['keys', 5],
    ['products', { ...userInfo.products, type2: [ { name: 'product-2', quantity: 30, id: 1, type: 'type2' } ] }],
    ['prices', { ...userInfo.prices, type2: [ [1, 2] ] }],
    ['types', { ...userInfo.types, type2: { name: 'type2', color: [0, 0, 255], id: 1 } }],
    ['conventions', [ ...userInfo.conventions, { name: 'convention-2', code: 'defgh', start: new Date(1497574926301), end: new Date(1497834126301) } ]],
  ];

  describe.skip('Sanity check', () => {
    it('should test all members', () => expect(tests.map((([_]) => _))).to.have.members(Object.keys(userInfo)));
  });

  it('should request the initial user info on start', () => {
    expect(APIServiceMock.getUserInfo).to.have.been.calledOnce;
  });

  tests.forEach(<K extends keyof UserInfo>([prop, updated]: [K, UserInfo[K]]) =>
    describe(`#${prop}`, () => {
      it('should be an Observable', () => expect(this.service[prop]).to.be.an.instanceOf(Observable))
      it(`should immediately emit the most recent value on subscribe`, done => {
        this.service[prop].take<UserInfo[K]>(1).subscribe(
          _ => expect(_, 'the observable should emit the initial value').to.deep.equal(userInfo[prop]),
          _ => expect.fail('the observable should not emit an error'),
          done,
        );
      });
      it(`should emit the updated properties when next is called`, done => {
        this.service[prop].take<UserInfo[K]>(2).toArray().subscribe(
          _ => expect(_, 'the observable should emit the updated after the initial value').to.deep.equal([userInfo[prop], updated]),
          _ => expect.fail('the observable should not emit an error'),
          done,
        );
        // NOTE: if typescript were smarter this wouldn't need a type annotation
        (this.service[prop] as Observer<UserInfo[K]>).next(updated);
      });
    })
  );
})
