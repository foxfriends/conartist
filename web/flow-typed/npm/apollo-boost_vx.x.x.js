// flow-typed signature: ed879f904f97325510c0a316524b81d2
// flow-typed version: <<STUB>>/apollo-boost_v0.1.4/flow_v0.69.0

declare module 'apollo-boost' {
  declare export class Operation {
    setContext(context: { headers: { [string]: string } }): void;
  }

  declare type ApolloClientOptions = {
    uri: string,
    request(operation: Operation): Promise<void>,
  };

  declare export type Query<Variables, Data> = {};
  declare export type Mutation<Variables, Data> = {};

  declare type QueryOptions<Variables, Data> = {
    query: Query<Variables, Data>,
    variables: Variables,
  };

  declare type MutationOptions<Variables, Data> = {
    mutation: Mutation<Variables, Data>,
    variables: Variables,
  };

  declare type GraphQLError = {
    message: string,
  }

  declare type GraphQLResponse<Data> = {
    data: Data,
    errors: ?GraphQLError[],
  }

  declare class ApolloClient {
    constructor(options: ApolloClientOptions): ApolloClient;
    query<Variables, Data>(options: QueryOptions<Variables, Data>): Promise<GraphQLResponse<Data>>;
    mutate<Variables, Data>(options: MutationOptions<Variables, Data>): Promise<GraphQLResponse<Data>>;
  }

  declare export default typeof ApolloClient;
}
