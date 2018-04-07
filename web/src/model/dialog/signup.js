/* @flow */
export type SignUp = { name: 'signup', step: Step }

interface Steppable {
  next(string): ?Step,
  previous(): ?Step,
}

export type Step = (Name | Email | Password | Terms | Completed) & Steppable

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

const nameStep: Step = {
  name: 'name',
  next(username: string) { return emailStep.call(this, username) },
  previous: () => null,
}

export const signup: SignUp = {
  name: 'signup',
  step: nameStep,
}

function emailStep(username: string): ?Step {
  return {
    name: 'email',
    username,
    next(email: string) { return passwordStep.call(this, email) },
    previous() { return nameStep },
  }
}

function passwordStep(email: string): ?Step {
  return {
    name: 'password',
    username: this.username,
    email,
    next(password: string) { return termsStep.call(this, password) },
    previous() { return emailStep.call(this, this.username) },
  }
}

function termsStep(password: string): ?Step {
  return {
    name: 'terms',
    username: this.username,
    email: this.email,
    password,
    next: () => completedStep.call(this),
    previous: () => passwordStep.call(this, this.email),
  }
}

function completedStep(): ?Step {
  return {
    name: 'completed',
    username: this.username,
    email: this.email,
    password: this.password,
    next: () => null,
    previous: () => null,
  }
}
