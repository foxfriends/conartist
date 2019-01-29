import { setConvention } from '../update/conventions'
import { LoadConvention } from '../api/load-convention'
import { UserQuery } from '../api/user-query'
import { setUser } from '../update/signin'

export function loadConvention(conId: number) {
  return new LoadConvention()
    .send({ conId })
    .toPromise()
    .then(response => {
      if(response.state === 'retrieved') {
        return response.value
      }
      throw new Error()
    })
    .then(setConvention)
}

export function loadUser() {
  return new UserQuery()
    .send()
    .toPromise()
    .then(response => {
      if(response.state === 'retrieved') {
        return response.value
      }
      throw new Error()
    })
    .then(setUser)
}
