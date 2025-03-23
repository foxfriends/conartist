/*       */
import { ApolloClient } from "apollo-client";
import { ApolloLink, Observable } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { Storage } from "../storage";
import { GraphQLURL } from "../constants";

async function addAuthorization(operation) {
  const authorization = Storage.retrieve(Storage.Auth);
  if (authorization) {
    const headers = { Authorization: `Bearer ${authorization}` };
    operation.setContext({ headers });
  }
}

// not sure about this one, copied from apollo-boost
const requestHandler = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then((oper) => addAuthorization(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => handle && handle.unsubscribe;
    }),
);

const link = ApolloLink.from([
  requestHandler,
  new BatchHttpLink({
    batchMax: 200,
    uri: `${GraphQLURL}/`,
    credentials: "same-origin",
  }),
]);

// NOTE: cache is disabled because it caused inconsistent data sometimes... Not sure if this is my
// fault or an Apollo bug, but it's not worth investigating at this time. See api/index.js for the
// part where cache is disabled...

const cache = new InMemoryCache();

export function clearCache() {
  cache.reset();
}

export const graphql = new ApolloClient({
  link,
  cache,
});
