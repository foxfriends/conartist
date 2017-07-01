import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { APIResult, UserInfo, Products, Prices, ProductTypes, MetaConvention, FullConvention, TypesUpdate, ProductsUpdate, PricesUpdate } from '../../../../conartist';

function handle<T>(response: Response): T {
  const result = response.json() as APIResult<T>;
  if(result.status === 'Success') {
    return result.data;
  } else {
    throw new Error(result.error);
  }
}

@Injectable()
export default class APIService {
  static readonly hostURL = 'http://localhost:8080';

  constructor(@Inject(Http) private http: Http) {}

  private get options(): RequestOptionsArgs {
    const headers = new Headers();
    const token = localStorage.getItem('authtoken');
    if(token) {
      headers.append('Authorization', `Bearer ${token}`)
    }
    return { headers };
  }

  static host([...strings]: TemplateStringsArray, ...params: any[]): string {
    function zip(a: string[], b: string[]) {
      a = [...a];
      for(let i = b.length - 1; i >= 0; --i) {
        a.splice(2 * i - 1, 0, b[i]);
      }
      return a;
    }
    return APIService.hostURL + zip(strings, params.map(_ => `${_}`)).join('');
  }

  isUniqueEmail(email: string): Observable<boolean> {
    return this.http
      .get(APIService.host`/api/account/exists/${email}`, this.options)
      .map(_ => handle<boolean>(_))
      .map(_ => !_);
  }

  signIn(usr: string, psw: string): Observable<string> {
    return this.http
      .post(APIService.host`/api/auth/`, { usr, psw })
      .map(_ => handle<string>(_))
      .catch(_ => Observable.throw(new Error('Incorrect username or password')));
  }

  reauthorize(): Observable<string> {
    return this.http
      .get(APIService.host`/api/auth/`, this.options)
      .map(_ => handle<string>(_))
      .catch(_ => Observable.throw(new Error('Invalid auth token')));
  }

  signUp(usr: string, psw: string): Observable<void> {
    return this.http
      .post(APIService.host`/api/account/new/`, { usr, psw }, this.options)
      .map(_ => { handle<void>(_); })
      .catch(_ => Observable.throw(new Error('Could not create your account')));
  }

  getConventions(start?: number, end?: number, limit?: number): Observable<MetaConvention[]> {
    let url = '/api/cons/';
    if(start) {
      url += `${start}/`;
      if(end) {
        url += `${end}/`;
        if(limit) {
          url += `${limit}/`;
        }
      }
    }
    return this.http
      .get(APIService.host `${url}`, this.options)
      .map(_ => handle<MetaConvention[]>(_));
  }

  getUserInfo(): Observable<UserInfo> {
    return this.http
      .get(APIService.host`/api/user/`, this.options)
      .map(_ => handle<UserInfo>(_));
  }

  loadConvention(code: string): Observable<FullConvention> {
    return this.http
      .get(APIService.host`/api/con/${code}/`, this.options)
      .map(_ => handle<FullConvention>(_))
      .catch(_ => Observable.throw(new Error(`Fetching convention for ${code} data failed`)));
  }

  saveTypes(types: ProductTypes): Observable<ProductTypes> {
    const updates: TypesUpdate = types
        .filter(_ => _.dirty)
        .map(_ =>
          _.id < 0  ? ({ kind: 'create' as 'create', name: _.name, color: _.color }) :
                    ({ kind: 'modify' as 'modify', name: _.name, color: _.color, id: _.id, discontinued: _.discontinued })
        );
    if(updates.length) {
      return this.http
        .put(APIService.host`/api/types/`, { types: updates }, this.options)
        .map(_ => handle<ProductTypes>(_))
        .catch(_ => Observable.throw(new Error('Could not save product types changes')));
    } else {
      return Observable.of([]);
    }
  }

  saveProducts(products: Products): Observable<Products> {
    const updates: ProductsUpdate = products
        .filter(_ => _.dirty)
        .map(_ =>
          _.id < 0  ? ({ kind: 'create' as 'create', name: _.name, type: _.type, quantity: _.quantity }) :
                      ({ kind: 'modify' as 'modify', name: _.name, type: _.type, quantity: _.quantity, id: _.id, discontinued: _.discontinued })
        );
    if(updates.length) {
      return this.http
        .put(APIService.host`/api/products/`, { products: updates }, this.options)
        .map(_ => handle<Products>(_))
        .catch(_ => Observable.throw(new Error('Could not save product changes')));
    } else {
      return Observable.of([]);
    }
  }

  savePrices(prices: Prices): Observable<Prices> {
    const updates: PricesUpdate = prices
        .filter(_ => _.dirty)
        .map(_ => ({ type_id: _.type, product_id: _.product, price: _.prices}));
    if(updates.length) {
      return this.http
        .put(APIService.host`/api/prices/`, { prices: updates }, this.options)
        .map(_ => handle<Prices>(_))
        .catch(_ => Observable.throw(new Error('Could not save price changes')));
    } else {
      return Observable.of([]);
    }
  }
}
