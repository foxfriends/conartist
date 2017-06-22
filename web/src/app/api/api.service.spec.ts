import { ReflectiveInjector } from '@angular/core';
import { Http, RequestOptions, BaseRequestOptions, Response, ResponseOptions, ConnectionBackend, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { expect } from 'chai';
import { Observable } from 'rxjs/Observable';

import APIService from './api.service';
import { newUser, userInfo, fullConventions } from './api.service.mock';
import { APISuccessResult, APIErrorResult, APIResult } from '../../../../conartist';

type Context = {
  service: APIService;
  backend: MockBackend;
};

describe('API Service', function(this: Mocha.ISuiteCallbackContext & Context) {
  class MockAPISuccessResult<T> implements APISuccessResult<T> {
    readonly status = 'Success';
    constructor(public data: T) {}
  }
  class MockAPIErrorResult implements APIErrorResult {
    static readonly errorMessage = 'error-message';
    readonly status = 'Error';
    readonly error = MockAPIErrorResult.errorMessage;
  }

  function respondWith<T>(body: APIResult<T>) {
    return (c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body })));
  }

  beforeEach('Provide and inject the services', () => {
    const injector = ReflectiveInjector.resolveAndCreate([
      {provide: ConnectionBackend, useClass: MockBackend},
      {provide: RequestOptions, useClass: BaseRequestOptions},
      Http, APIService,
    ]);
    this.service = injector.get(APIService);
    this.backend = injector.get(ConnectionBackend) as MockBackend;
  });

  describe('@host', () => {
    it('should attach the hostname to the template string', () => {
      expect(APIService.host`/test/url/`).to.equal(APIService.hostURL + '/test/url/');
    });
    it('should properly handle template parameters', () => {
      const argument = 'arg-value';
      expect(APIService.host`/test/url/${argument}/`).to.equal(APIService.hostURL + '/test/url/arg-value/');
    });
  });

  // TODO: can these be dynamically generated?

  describe('#isUniqueEmail', () => {
    it('should request [GET /api/account/exists/:usr]', done => {
      this.backend.connections.take(1).subscribe(
        (c: MockConnection) => {
          expect(c.request.method).to.equal(RequestMethod.Get);
          expect(c.request.url).to.equal(APIService.host`/api/account/exists/${newUser.email}`);
        },
        void 0,
        done,
      );
      this.service.isUniqueEmail(newUser.email);
    });

    it('should return an observable of the success result body', done => {
      this.backend.connections.take(1).subscribe(respondWith(new MockAPISuccessResult(true)));
      const result = this.service.isUniqueEmail(newUser.email);
      expect(result).to.be.an.instanceOf(Observable);
      result.subscribe(
        _ => expect(_, 'the value should be negated').to.be.false,
        _ => expect.fail('the observable should not emit an error'),
        done,
      );
    });
  });

  describe('#signIn', () => {
    it('should request [POST /api/auth/] with usr and psw in the body', done => {
      this.backend.connections.take(1).subscribe(
        (c: MockConnection) => {
          expect(c.request.method).to.equal(RequestMethod.Post);
          expect(c.request.url).to.equal(APIService.host`/api/auth/`);
          expect(JSON.parse(c.request.getBody())).to.deep.equal({
            usr: newUser.email, psw: newUser.password
          });
        },
        void 0,
        done,
      );
      this.service.signIn(newUser.email, newUser.password);
    });

    it('should return an observable of the success result body', done => {
      const JWT = 'FakeJWT';
      this.backend.connections.take(1).subscribe(respondWith(new MockAPISuccessResult(JWT)));
      const result = this.service.signIn(newUser.email, newUser.password);
      expect(result).to.be.an.instanceOf(Observable);
      result.subscribe(
        _ => expect(_, 'the JWT should be emitted').to.equal(JWT),
        _ => expect.fail('the observable should not emit an error'),
        done,
      );
    });

    it('should produce the correct error message on an error result', done => {
      this.backend.connections.take(1).subscribe(respondWith(new MockAPIErrorResult));
      this.service.signIn(newUser.email, newUser.password).subscribe(
        () => expect.fail('the observable should emit an error'),
        _ => {
          expect(_, 'the observable should produce an Error object').to.be.an.instanceOf(Error);
          expect(_.message, 'the error should have the right message').to.deep.equal('Incorrect username or password');
          done();
        },
      );
    });
  });

  describe('#signUp', () => {
    it('should request [POST /api/account/new/] with usr and psw in the body', done => {
      this.backend.connections.take(1).subscribe(
        (c: MockConnection) => {
          expect(c.request.method).to.equal(RequestMethod.Post);
          expect(c.request.url).to.equal(APIService.host`/api/account/new/`);
          expect(JSON.parse(c.request.getBody())).to.deep.equal({
            usr: newUser.email, psw: newUser.password
          });
        },
        void 0,
        done,
      );
      this.service.signUp(newUser.email, newUser.password);
    });

    it('should return an observable of the success result body', done => {
      const JWT = 'FakeJWT';
      this.backend.connections.take(1).subscribe(respondWith(new MockAPISuccessResult(JWT)));
      const result = this.service.signUp(newUser.email, newUser.password);
      expect(result).to.be.an.instanceOf(Observable);
      result.subscribe(
        _ => expect(_, 'no value should be emitted').to.be.undefined,
        _ => expect.fail('the observable should not emit an error'),
        done,
      );
    });

    it('should produce the correct error message on an error result', done => {
      this.backend.connections.take(1).subscribe(respondWith(new MockAPIErrorResult));
      this.service.signUp(newUser.email, newUser.password).subscribe(
        () => expect.fail('the observable should emit an error'),
        _ => {
          expect(_, 'the observable should produce an Error object').to.be.an.instanceOf(Error);
          expect(_.message, 'the error should have the right message').to.deep.equal('Could not create your account');
          done();
        },
      );
    });
  });

  describe('#getUserInfo', () => {
    it('should request [GET /api/user/] with the authorization header', done => {
      const JWT = 'FakeJWT';
      localStorage.setItem('authtoken', JWT);
      this.backend.connections.take(1).subscribe(
        (c: MockConnection) => {
          expect(c.request.method).to.equal(RequestMethod.Get);
          expect(c.request.url).to.equal(APIService.host`/api/user/`);
          expect(c.request.headers.get('Authorization')).to.equal(`Bearer ${JWT}`);
        },
        void 0,
        done,
      );
      this.service.getUserInfo();
      localStorage.removeItem('authtoken');
    });

    it('should return an observable of the success result body', done => {
      this.backend.connections.take(1).subscribe(respondWith(new MockAPISuccessResult(userInfo)));
      const result = this.service.getUserInfo();
      expect(result).to.be.an.instanceOf(Observable);
      result.subscribe(
        _ => expect(_, 'the UserInfo should be emitted').to.deep.equal(userInfo),
        _ => expect.fail('the observable should not emit an error'),
        done,
      );
    });
  });

  describe('#loadConvention', () => {
    it('should request [GET /api/con/:code] with the authorization header', done => {
      const JWT = 'FakeJWT';
      const conCode = 'abcde';
      localStorage.setItem('authtoken', JWT);
      this.backend.connections.take(1).subscribe(
        (c: MockConnection) => {
          expect(c.request.method).to.equal(RequestMethod.Get);
          expect(c.request.url).to.equal(APIService.host`/api/con/${conCode}/`);
          expect(c.request.headers.get('Authorization')).to.equal(`Bearer ${JWT}`);
        },
        void 0,
        done,
      );
      this.service.loadConvention(conCode);
      localStorage.removeItem('authtoken');
    });

    it('should return an observable of the success result body', done => {
      this.backend.connections.take(1).subscribe(respondWith(new MockAPISuccessResult(fullConventions[0])));
      const result = this.service.loadConvention('');
      expect(result).to.be.an.instanceOf(Observable);
      result.subscribe(
        _ => expect(_, 'the UserInfo should be emitted').to.deep.equal(fullConventions[0]),
        _ => expect.fail('the observable should not emit an error'),
        done,
      );
    });

    it('should produce the correct error message on an error result', done => {
      const conCode = 'abcde';
      this.backend.connections.take(1).subscribe(respondWith(new MockAPIErrorResult));
      this.service.loadConvention(conCode).subscribe(
        () => expect.fail('the observable should emit an error'),
        _ => {
          expect(_, 'the observable should produce an Error object').to.be.an.instanceOf(Error);
          expect(_.message, 'the error should have the right message').to.deep.equal(`Fetching convention for ${conCode} data failed`);
          done();
        },
      );
    });
  });
});
