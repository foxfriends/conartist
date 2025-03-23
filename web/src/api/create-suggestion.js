/*       */
                                                 
import { from } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/suggestion'
                                                   
             
                                               
                            
                 
                                                     

export class CreateSuggestion                                                        {
  delUserConvention                                                                      

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const createSuggestion = import(/* webpackChunkName: 'suggestions' */ './graphql/mutation/create-suggestion.graphql')
    this.createSuggestion = createSuggestion.then(createSuggestion => new GraphQLMutation(createSuggestion.default))
  }

  send(variables                           )                                           {
    return from(this.createSuggestion)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: parse(response.value.createSuggestion) }
          : response
        ),
      )
  }
}
