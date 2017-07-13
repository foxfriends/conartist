export default class ConEvent<T> {
  constructor(
    public type: Symbol,
    public payload?: T,
  ) {}
};

const SIGN_IN_EVENT = Symbol('Event: sign in');
export class SignInEvent extends ConEvent<void> {
  constructor() {
    super(SIGN_IN_EVENT);
  }
}
