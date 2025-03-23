/*       */
                                                 
import { map } from 'rxjs/operators'

import { GraphQLQuery } from './index'
// $FlowIgnore: trouble importing graphql files
import query from './graphql/query/full-convention.graphql'
import { parse } from '../model/full-convention'
                                                             
                                                                                              
                                                              

export class LoadConvention                                                                {
  query                                                            

  constructor() {
    this.query = new GraphQLQuery(query)
  }

  send(variables                         )                                                 {
    return this.query.send(variables)
      .pipe(
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.convention) }
          : response
        )
      )
  }
}
