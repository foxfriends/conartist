import { expect } from 'chai';
import { spy, SinonSpy as Spy } from 'sinon';
import StorageService from './storage.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';

import APIServiceMock, { validConCode, conventions, fullConventions } from '../api/api.service.mock';
import { UserInfo } from '../../../../conartist';

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

  const tests: (keyof UserInfo)[] = ['email', 'keys', 'products', 'prices', 'types', 'conventions'];

  it('should request the initial user info on start', () => {
    expect(APIServiceMock.getUserInfo).to.have.been.calledOnce;
  });

  tests.forEach((prop: keyof UserInfo) =>
    describe(`#${prop}`, () => {
      it('should be a BehaviorSubject', () => expect(this.service[prop]).to.be.an.instanceOf(BehaviorSubject));
    })
  );

  describe('#convention(code)', () => {
    it('should be an Observable', () => expect(this.service.convention(validConCode)).to.be.an.instanceOf(Observable));
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
      );
    });
  });
})
