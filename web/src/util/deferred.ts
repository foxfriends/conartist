type Resolve<T> = (value?: T | PromiseLike<T>) => void;
type Reject = (value: any) => void;

export class Deferred<T> extends Promise<T> {
  private readonly _resolve: Resolve<T>;
  private readonly _reject: Reject;

  constructor(fallback?: (resolve: Resolve<T>, reject: Reject) => void) {
    let resolve: Resolve<T> | null, reject: Reject | null;
    super((res, rej) => {
      fallback && fallback(res, rej);
      resolve = res;
      reject = rej;
    });
    // tslint:disable-next-line
    this._resolve = resolve!;
    // tslint:disable-next-line
    this._reject = reject!;
  }

  resolve(val?: T) { this._resolve(val); }
  reject(reason: any) { this._reject(reason); }
}
