/* @flow */
import type { Response, Failed, Retrieved } from './index'

export function batchResponses<T, E>(responses: Response<T, E>[]): Failed<E[]> | Retrieved<T[]> {
  return (
    responses
      .reduce(
        (result, response) => {
          if (result.state === 'retrieved' && response.state === 'retrieved') {
            return { state: 'retrieved', value: [...result.value, response.value] }
          } else if(result.state === 'failed' && response.state === 'failed') {
            return { state: 'failed', error: [...result.error, response.error] }
          } else if(result.state === 'retrieved' && response.state === 'failed') {
            return { state: 'failed', error: [response.error] }
          }
          return result
        },
        ({ state: 'retrieved', value: [] }: Retrieved<T[]>),
      )
  )
}
