/* @flow */
import { ApolloClient } from 'apollo-client'
import { ApolloLink, Observable } from 'apollo-link'
import { BatchHttpLink } from 'apollo-link-batch-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { Storage } from '../storage'
import { BaseURL } from '../constants'

export type Operation = {
  setContext(context: { headers: { [string]: string } }): void;
}

type ApolloClientOptions = {
  uri: string,
  request(operation: Operation): Promise<void>,
};

export type Query<Variables, Data> = {};
export type Mutation<Variables, Data> = {};

type QueryOptions<Variables, Data> = {
  query: Query<Variables, Data>,
  variables: Variables,
};

type MutationOptions<Variables, Data> = {
  mutation: Mutation<Variables, Data>,
  variables: Variables,
};

type GraphQLError = {
  message: string,
}

type GraphQLResponse<Data> = {
  data: Data,
  errors: ?GraphQLError[],
}

async function addAuthorization(operation: Operation) {
  const authorization = Storage.retrieve(Storage.Auth)
  if (authorization) {
    const headers = { Authorization: `Bearer ${authorization}` }
    operation.setContext({ headers })
  }
}

// not sure about this one, copied from apollo-boost
const requestHandler = new ApolloLink((operation, forward) =>
  new Observable(observer => {
    let handle
    Promise.resolve(operation)
      .then(oper => addAuthorization(oper))
      .then(() => {
        handle = forward(operation).subscribe({
          next: observer.next.bind(observer),
          error: observer.error.bind(observer),
          complete: observer.complete.bind(observer),
        });
      })
      .catch(observer.error.bind(observer))

    return () => handle && handle.unsubscribe
  })
)

const link = ApolloLink.from([
  requestHandler,
  new BatchHttpLink({
    batchMax: 200,
    uri: `${BaseURL}/api/v2/`,
    credentials: 'same-origin',
  }),
])

const cache = new InMemoryCache()

export function clearCache() {
  cache.reset()
}

export const graphql = new ApolloClient({
  link,
  cache,
})
