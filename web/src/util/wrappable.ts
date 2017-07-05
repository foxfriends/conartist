// TODO: can this be more efficient than a while loop?
export const Wrappable = <T>(array: T[]) => new Proxy(array, {
  get(target, prop) {
    if(typeof prop === 'string') {
      prop = isNaN(parseInt(prop, 10)) ? prop : parseInt(prop, 10);
    }
    if(typeof prop === 'number') {
      while(prop < 0) { prop += target.length; }
      return target[prop % target.length];
    }
    return target[prop as keyof T[]];
  },

  set(target, prop, value: T) {
    if(typeof prop === 'string') {
      prop = isNaN(parseInt(prop, 10)) ? prop : parseInt(prop, 10);
    }
    if(typeof prop === 'number') {
      while(prop < 0) { prop += target.length; }
      target[prop % target.length] = value;
      return true;
    }
    return false;
  }
});

export default Wrappable;
