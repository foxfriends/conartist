export interface Wait<T> extends Promise<T> {
  cancel(): void;
  reset(): void;
  skip(): void;
}
export type ResRej<T> = (value?: T | PromiseLike<T>) => void;
export const wait = <T>(time: number = 0, cb?: (resolve: ResRej<T>, reject: ResRej<T>) => T | PromiseLike<T>) => {
  let timeout: number;
  let res: ResRej<T>;
  let rej: ResRej<T>;
  const pr = new Promise<T>((resolve, reject) => {
    timeout = setTimeout(() => cb ? cb(resolve, reject) : resolve(), time);
    res = resolve;
    rej = reject;
  }) as Wait<T>;
  pr.cancel = (): Wait<T> => {
    clearTimeout(timeout);
    rej();
    return pr;
  };
  pr.skip = (): Wait<T> => {
    clearTimeout(timeout);
    cb ? cb(res, rej) : res();
    return pr;
  };
  pr.reset = (): Wait<T> => {
    clearTimeout(timeout);
    timeout = setTimeout(() => cb ? cb(res, rej) : res(), time);
    return pr;
  };
  return pr;
};
