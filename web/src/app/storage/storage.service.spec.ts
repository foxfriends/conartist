import { expect } from 'chai';
import { spy, SinonSpy as Spy } from 'sinon';
import StorageService from './storage.service';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';

import APIServiceMock, { newUser, userInfo, validConCode, conventions, fullConventions } from '../api/api.service.mock';
import { UserInfo, Convention } from '../../../../conartist';

type Context = {
  service: StorageService;
  getUserInfo: Spy;
  loadConvention: Spy;
};

describe('Storage Service', function(this: Mocha.ISuiteCallbackContext & Context) {
  before('Spy on the APIService#getUserInfo', () => this.getUserInfo = spy(APIServiceMock, 'getUserInfo'));
  before('Spy on the APIService#loadConvention', () => this.loadConvention = spy(APIServiceMock, 'loadConvention'));
  afterEach('Reset the APIService#getUserInfo spy', () => this.getUserInfo.reset());
  afterEach('Reset the APIService#loadConvention spy', () => this.loadConvention.reset());
  after('Un-spy on the APIService#getUSerInfo', () => this.getUserInfo.restore());
  after('Un-spy on the APIService#loadConvention', () => this.loadConvention.restore());

  beforeEach('Create a new Storage service', () => this.service = new StorageService(APIServiceMock));

  const tests = [
    ['email', newUser.email],
    ['keys', 5],
    ['products', { ...userInfo.products, type2: [ { name: 'product-2', quantity: 30, id: 1, type: 'type2' } ] }],
    ['prices', { ...userInfo.prices, type2: [ [1, 2] ] }],
    ['types', { ...userInfo.types, type2: { name: 'type2', color: [0, 0, 255], id: 1 } }],
    ['conventions', [ ...userInfo.conventions, { name: 'convention-2', code: 'defgh', start: new Date(1497574926301), end: new Date(1497834126301) } ]],
  ];

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

  describe('#convention(code)', () => {
    it('should be an Observable', () => expect(this.service.convention(validConCode)).to.be.an.instanceOf(Observable));
    it('should immediately emit the most recent value on subscribe', done => {
      this.service.convention(validConCode).take<Convention>(1).subscribe(
        _ => expect(_, 'the observable should emit the initial value').to.deep.equal(conventions.find(_ => _.code === validConCode)),
        _ => expect.fail('the observable should not emit an error'),
        done,
      );
    });
  });

  describe('#updateConvention(convention)', () => {
    it('should cause #convention(code) to emit an event with the filled convention', done => {
      const gen = (function*(): any { // typescript why
        expect(yield).to.deep.equal(conventions.find(_ => _.code === validConCode));
        expect(yield).to.deep.equal(fullConventions.find(_ => _.code === validConCode));
        done();
      })();
      gen.next();
      this.service.convention(validConCode).take(2).subscribe(_ => gen.next(_));
      this.service.updateConvention(fullConventions.find(_ => _.code === validConCode)!);
    });
    it('should cause #conventions to emit an event including the filled convention', done => {
      const gen = (function*(): any { // typescript why
        expect(yield).to.deep.equal(conventions);
        expect(yield).to.deep.equal(conventions.map(_ => _.code === validConCode ? fullConventions.find(_ => _.code === validConCode) : _));
        done();
      })();
      gen.next();
      this.service.conventions.take(2).subscribe(_ => gen.next(_));
      this.service.updateConvention(fullConventions.find(_ => _.code === validConCode)!);
    });
  });

  describe('#fillConvention(code)', () => {
    it('should call the API when the requested convention is not filled', () => {
      this.service.fillConvention(validConCode);
      expect(this.loadConvention, 'the API should only be accessed once').to.have.been.calledOnce;
      expect(this.loadConvention, 'the right con code should be passed to the API').to.have.been.calledWith(validConCode);
    });
    it('should cause #convention(code) to emit an event with the filled convention', done => {
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
      )
    });
  });
})
