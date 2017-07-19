import { ReflectiveInjector } from '@angular/core';
import { Http, RequestOptions, BaseRequestOptions, Response, ResponseOptions, ConnectionBackend, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { expect } from 'chai';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { newUser, userInfo, conventions, types, products, prices, fullConventions } from './api.service.mock';

type Context = {
  service: APIService;
  backend: MockBackend;
};

describe('API Service', function(this: Mocha.ISuiteCallbackContext & Context) {
  const shouldNotRequest = <K extends keyof APIService>(prop: K, args: any[]) =>
    it(`should not send a request`, () => {
      this.backend.connections.take(1).subscribe(
        () => expect.fail('a request should not be sent'),
      );
      this.service[prop](...args);
    });
  const shouldRequest = <K extends keyof APIService>(prop: K, args: any[], method: 'Get' | 'Put' | 'Post', url: string) =>
    it(`should request [${method.toUpperCase()} ${url}]`, done => {
      this.backend.connections.take(1).subscribe(
        (c: MockConnection) => {
          expect(c.request.method).to.equal(RequestMethod[method]);
          expect(c.request.url).to.equal(APIService.host`${url}`);
        },
        void 0,
        done,
      );
      this.service[prop](...args);
    });
  const shouldRequestWithBody = <K extends keyof APIService, T>(prop: K, args: any[], method: 'Get' | 'Put' | 'Post', url: string, body: T) =>
    it(`should request [${method.toUpperCase()} ${url}] with a body`, done => {
      this.backend.connections.take(1).subscribe(
        (c: MockConnection) => {
          expect(c.request.method).to.equal(RequestMethod[method]);
          expect(c.request.url).to.equal(APIService.host`${url}`);
          expect(JSON.parse(c.request.getBody())).to.deep.equal(body);
        },
        void 0,
        done,
      );
      this.service[prop](...args);
    });
  const shouldRequestWithAuthHeader = <K extends keyof APIService>(prop: K, args: any[], method: 'Get' | 'Put' | 'Post', url: string) =>
    it(`should request [${method.toUpperCase()} ${url}] with the authorization header`, done => {
      const JWT = 'FakeJWT';
      localStorage.setItem('authtoken', JWT);
      this.backend.connections.take(1).subscribe(
        (c: MockConnection) => {
          expect(c.request.method).to.equal(RequestMethod[method]);
          expect(c.request.url).to.equal(APIService.host`${url}`);
          expect(c.request.headers.get('Authorization')).to.equal(`Bearer ${JWT}`);
        },
        void 0,
        done,
      );
      this.service[prop](...args);
      localStorage.removeItem('authtoken');
    });
  const shouldReturnAnObservable = <K extends keyof APIService, T>(prop: K, args: any[], response: T, expected: T) =>
    it('should return an observable of the success result body', done => {
      this.backend.connections.take(1).subscribe(respondWith(new MockAPISuccessResult(response)));
      const result: Observable<T> = this.service[prop](...args);
      expect(result).to.be.an.instanceOf(Observable);
      result.subscribe(
        (_: T) => expect(_, 'the correct response should be emitted').to.deep.equal(expected),
        () => expect.fail('the observable should not emit an error'),
        done,
      );
    });
  const shouldProduceTheCorrectError = <K extends keyof APIService>(prop: K, args: any[], error: string) =>
    it('should produce the correct error message on an error result', done => {
      this.backend.connections.take(1).subscribe(respondWith(new MockAPIErrorResult));
      this.service[prop](...args).subscribe(
        () => expect.fail('the observable should emit an error'),
        (_: Error) => {
          expect(_, 'the observable should produce an Error object').to.be.an.instanceOf(Error);
          expect(_.message, 'the error should have the right message').to.deep.equal(error);
          done();
        },
      );
    });


  class MockAPISuccessResult<T> implements ca.APISuccessResult<T> {
    readonly status = 'Success';
    constructor(public data: T) {}
  }
  class MockAPIErrorResult implements ca.APIErrorResult {
    static readonly errorMessage = 'error-message';
    readonly status = 'Error';
    readonly error = MockAPIErrorResult.errorMessage;
  }

  function respondWith<T>(body: ca.APIResult<T>) {
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

  describe('#isUniqueEmail', () => {
    shouldRequest('isUniqueEmail', [newUser.email], 'Get', `/api/account/exists/${newUser.email}`)
    shouldReturnAnObservable('isUniqueEmail', [newUser.email], true, false);
  });

  describe('#signIn', () => {
    shouldRequestWithBody('signIn', [newUser.email, newUser.password], 'Post', '/api/auth/', { usr: newUser.email, psw: newUser.password });
    shouldReturnAnObservable('signIn', [newUser.email, newUser.password], 'FakeJWT', 'FakeJWT');
    shouldProduceTheCorrectError('signIn', [newUser.email, newUser.password], 'Incorrect username or password');
  });

  describe('#reauthorize', () => {
    shouldRequest('reauthorize', [], 'Get', '/api/auth/');
    shouldReturnAnObservable('reauthorize', [], 'FakeJWT', 'FakeJWT');
    shouldProduceTheCorrectError('reauthorize', [], 'Invalid auth token');
  });

  describe('#signUp', () => {
    shouldRequestWithBody('signUp', [newUser.email, newUser.password], 'Post', '/api/account/new/', { usr: newUser.email, psw: newUser.password });
    shouldReturnAnObservable('signUp', [newUser.email, newUser.password], 'FakeJWT', undefined);
    shouldProduceTheCorrectError('signUp', [newUser.email, newUser.password], 'Could not create your account');
  });

  describe('#getConventions', () => {
    shouldRequestWithAuthHeader('getConventions', [], 'Get', '/api/cons/');
    shouldRequestWithAuthHeader('getConventions', [1], 'Get', '/api/cons/1/');
    shouldRequestWithAuthHeader('getConventions', [1, 2], 'Get', '/api/cons/1/2/');
    shouldRequestWithAuthHeader('getConventions', [1, 2, 3], 'Get', '/api/cons/1/2/3/');
    shouldReturnAnObservable('getConventions', [], conventions, conventions);
  });

  describe('#getUserInfo', () => {
    shouldRequestWithAuthHeader('getUserInfo', [], 'Get', '/api/user/');
    shouldReturnAnObservable('getUserInfo', [], userInfo, userInfo);
  });

  describe('#loadConvention', () => {
    shouldRequestWithAuthHeader('loadConvention', ['abcde'], 'Get', '/api/con/abcde/');
    shouldReturnAnObservable('loadConvention', [''], fullConventions[0], fullConventions[0]);
    shouldProduceTheCorrectError('loadConvention', ['abcde'], 'Fetching convention data for abcde failed');
  });

  describe('#saveTypes', () => {
    shouldRequestWithAuthHeader('saveTypes', [types.map(_ => ({ ..._, dirty: true }))], 'Put', '/api/types/');
    shouldRequestWithBody('saveTypes', [types.map(_ => ({ ..._, dirty: true }))], 'Put', '/api/types/',
      { types: types.map(_ => ({ kind: 'modify' as 'modify', name: _.name, color: _.color, id: _.id, discontinued: _.discontinued })) }
    );
    shouldRequestWithBody('saveTypes', [[{ name: 'name', id: -1, color: 0xffffff, discontinued: false, dirty: true }]], 'Put', '/api/types/',
      { types: [{ kind: 'create' as 'create', name: 'name', color: 0xffffff }] }
    );
    shouldNotRequest('saveTypes', [types]);
  });

  describe('#saveProducts', () => {
    shouldRequestWithAuthHeader('saveProducts', [products.map(_ => ({ ..._, dirty: true }))], 'Put', '/api/products/');
    shouldRequestWithBody('saveProducts', [products.map(_ => ({ ..._, dirty: true }))], 'Put', '/api/products/',
      { products: products.map(_ => ({ kind: 'modify' as 'modify', name: _.name, type: _.type, quantity: _.quantity, id: _.id, discontinued: _.discontinued })) }
    );
    shouldRequestWithBody('saveProducts', [[{ name: 'name', id: -1, type: 1, quantity: 15, discontinued: false, dirty: true }]], 'Put', '/api/products/',
      { products: [{ kind: 'create' as 'create', name: 'name', type: 1, quantity: 15 }] }
    );
    shouldNotRequest('saveProducts', [products]);
  });

  describe('#savePrices', () => {
    shouldRequestWithAuthHeader('savePrices', [prices.map(_ => ({ ..._, dirty: true }))], 'Put', '/api/prices/');
    shouldRequestWithBody('savePrices', [prices.map(_ => ({ ..._, dirty: true }))], 'Put', '/api/prices/',
      { prices: prices.map(_ => ({ type_id: _.type, product_id: _.product, price: _.prices})) }
    );
    shouldNotRequest('savePrices', [prices]);
  });

  describe('#saveConventions', () => {
    shouldRequestWithAuthHeader('saveConventions', [conventions.map(_ => ({ ..._, dirty: true }))], 'Put', '/api/cons/');
    shouldRequestWithBody('saveConventions', [conventions.map(_ => ({ ..._, dirty: true }))], 'Put', '/api/cons/',
      { conventions: conventions.map(_ => ({ type: 'add' as 'add', code: _.code })) }
    );
    shouldRequestWithBody('saveConventions', [fullConventions.map(_ => ({ ..._, dirty: true }))], 'Put', '/api/cons/',
      { conventions: fullConventions.map(_ => ({ type: 'modify' as 'modify', code: _.code, data: { products: [], prices: [] } })) },
    );
    shouldRequestWithBody('saveConventions', [[{ type: 'invalid', code: 'abcde', dirty: true }]], 'Put', '/api/cons/',
      { conventions: [{ type: 'remove', code: 'abcde' }] },
    );
    shouldNotRequest('saveConventions', [conventions]);
    shouldNotRequest('saveConventions', [fullConventions]);
  });
});
