/*       */
export default class DefaultMap extends Map {
  default;

  constructor(init, def) {
    super(init);
    this.default = def;
  }

  get(key) {
    return super.get(key) || this.default;
  }

  set(key, value) {
    return super.set(key, value);
  }
}
