/* @flow */
export type SignUp = { name: 'signup', step: Step }

interface NextStep {
  next(string): ?Step
}

export type Step = (Name | Email | Password | Terms | Completed) & NextStep

export type Name = {
  name: 'name',
}

export type Email = {
  name: 'email',
  username: string,
}

export type Password = {
  name: 'password',
  username: string,
  email: string,
}

export type Terms = {
  name: 'terms',
  username: string,
  email: string,
  password: string,
}

export type Completed = {
  name: 'completed',
  username: string,
  email: string,
  password: string,
}

function email(username: string): ?Step {
  return {
    name: 'email',
    username,
    next(email: string) { password.call(this, email) },
  }
}

function password(email: string): ?Step {
  return {
    name: 'password',
    username: this.username,
    email,
    next(password: string) { terms.call(this, password) }
  }
}

function terms(password: string): ?Step {
  return {
    name: 'completed',
    username: this.username,
    email: this.email,
    password,
    next: () => null
  }
}

export const signup: SignUp = {
  name: 'signup',
  step: {
    name: 'name',
    next: email,
  },
}

