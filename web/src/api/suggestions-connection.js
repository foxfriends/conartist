/*       */
                                                 
import { map } from 'rxjs/operators'

import { GraphQLQuery } from './index'
                                                             
             
                                                      
                                 
                 
                                                     

import { parse } from '../model/suggestion'
                                                     

// $FlowIgnore: trouble importing graphql files
import suggestionsConnection from './graphql/query/suggestions-connection.graphql'

                      
                 
 

export class SuggestionsConnection                                                       {
  suggestionsConnection                                                                          

  constructor() {
    this.suggestionsConnection = new GraphQLQuery(suggestionsConnection)
  }

  send({ after }         = {})                                                         {
    return this.suggestionsConnection.send({ after: after || null })
      .pipe(
        map(
          response => response.state === 'retrieved'
            ? {
                state: 'retrieved',
                value: {
                  nodes: response.value.suggestionsConnection.nodes.map(parse),
                  endCursor: response.value.suggestionsConnection.endCursor,
                  totalNodes: response.value.suggestionsConnection.totalNodes,
                }
              }
            : response
        )
      )
  }
}
