import { Injectable, Inject } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const DATE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
function parseDates(_key: string, value: any) {
  if(typeof value === 'string' && DATE.test(value)) {
    return new Date(value);
  }
  return value;
}

function handle<T>(response: Response): T {
  const result = JSON.parse(response.text(), parseDates) as ca.APIResult<T>;
  if(result.status === 'Success') {
    return result.data;
  } else {
    throw new Error(result.error);
  }
}

function updatedProducts(products: ca.Products): ca.ProductsUpdate {
  return products
    .filter(_ => _.dirty)
    .map(_ =>
      _.id < 0  ? ({ kind: 'create' as 'create', name: _.name, type: _.type, quantity: _.quantity })
                : ({ kind: 'modify' as 'modify', name: _.name, type: _.type, quantity: _.quantity, id: _.id, discontinued: _.discontinued })
    );
}

function updatedPrices(prices: ca.SimplePrices): ca.PricesUpdate {
  return prices
    .filter(_ => _.dirty)
    .reduce((prev, row) => {
      const i = prev.findIndex(_ => _.type_id === row.type && _.product_id === row.product);
      if(i === -1) {
        const next = prices.filter(_ => _.type === row.type && _.product === row.product)
          .reduce((price, current) => {
            // negative price meant that it was deleted
            return { ...price, price: [...price.price, [current.quantity, current.price]].filter(_ => _[1] > 0) };
          }, { type_id: row.type, product_id: row.product, price: [] } as ca.PriceUpdate);
        return [...prev, next];
      } else {
        return prev;
      }
    }, [] as ca.PricesUpdate);
}

@Injectable()
export class APIService {
  static readonly hostURL = `${window.location.protocol}//${window.location.host}`;
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

  constructor(
    @Inject(Http) private http: Http,
  ) {}

  private get options(): RequestOptionsArgs {
    const headers = new Headers();
    const token = localStorage.getItem('authtoken');
    if(token) {
      headers.append('Authorization', `Bearer ${token}`)
    }
    return { headers };
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
      .map(_ => { handle(_); })
      .catch(_ => Observable.throw(new Error('Could not create your account')));
  }

  getConventions(page?: number, limit?: number): Observable<ca.MetaConvention[]> {
    let url = '/api/cons/';
    if(page) {
      url += `${page}/`;
      if(limit) {
        url += `${limit}/`;
      }
    }
    return this.http
      .get(APIService.host `${url}`, this.options)
      .map(_ => handle<ca.MetaConvention[]>(_));
  }

  getUserInfo(): Observable<ca.UserInfo> {
    return this.http
      .get(APIService.host`/api/user/`, this.options)
      .map(_ => handle<ca.UserInfo>(_));
  }

  loadConvention(code: string): Observable<ca.FullConvention> {
    return this.http
      .get(APIService.host`/api/con/${code}/`, this.options)
      .map(_ => handle<ca.FullConvention>(_))
      .catch(_ => Observable.throw(new Error(`Fetching convention data for ${code} failed`)));
  }

  saveTypes(types: ca.ProductTypes): Observable<ca.ProductTypes> {
    const updates: ca.TypesUpdate = types
        .filter(_ => _.dirty)
        .map(_ =>
          _.id < 0  ? ({ kind: 'create' as 'create', name: _.name, color: _.color })
                    : ({ kind: 'modify' as 'modify', name: _.name, color: _.color, id: _.id, discontinued: _.discontinued })
        );
    if(updates.length) {
      return this.http
        .put(APIService.host`/api/types/`, { types: updates }, this.options)
        .map(_ => handle<ca.ProductTypes>(_))
        .catch(_ => Observable.throw(new Error('Could not save product types changes')));
    } else {
      return Observable.of([]);
    }
  }

  saveProducts(products: ca.Products): Observable<ca.Products> {
    const updates = updatedProducts(products);
    if(updates.length) {
      return this.http
        .put(APIService.host`/api/products/`, { products: updates }, this.options)
        .map(_ => handle<ca.Products>(_))
        .catch(_ => Observable.throw(new Error('Could not save product changes')));
    } else {
      return Observable.of([]);
    }
  }

  savePrices(prices: ca.SimplePrices): Observable<ca.SimplePrices> {
    const updates = updatedPrices(prices);
    if(updates.length) {
      return this.http
        .put(APIService.host`/api/prices/`, { prices: updates }, this.options)
        .map(_ => handle<ca.SimplePrices>(_))
        .catch(_ => Observable.throw(new Error('Could not save price changes')));
    } else {
      return Observable.of([]);
    }
  }

  saveConventions(conventions: ca.Conventions): Observable<void> {
    const updates: ca.ConventionsUpdate = conventions
      .filter(_ => _.dirty)
      .map(_ =>
        _.type === 'meta' ? ({ type: 'add' as 'add', code: _.code }) // : // NOTE: updating conventions is currently unneeded and unsupported
        // _.type === 'full' ? ({ type: 'modify' as 'modify', code: _.code, data: { products: updatedProducts(_.data.products) as ca.ModifyProduct[], prices: updatedPrices(_.data.prices) }})
                          : ({ type: 'remove' as 'remove', code: _.code })
      );
    if(updates.length) {
      return this.http
        .put(APIService.host`/api/cons/`, { conventions: updates }, this.options)
        .map(_ => { handle(_) })
        .catch(_ => Observable.throw(new Error('Could not save convention changes')));
    } else {
      return Observable.of<void>();
    }
  }
}
