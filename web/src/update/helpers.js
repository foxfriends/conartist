import { setConvention } from '../update/conventions'
import { LoadConvention } from '../api/load-convention'

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
