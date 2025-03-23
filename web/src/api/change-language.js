/*       */
                                                 
import { from } from 'rxjs';
import { map, flatMap } from 'rxjs/operators'

import { GraphQLMutation } from './index'
import { parse } from '../model/user'
                                                             
             
                                           
                          
                 

export class ChangeLanguage                                                        {
  changeLanguage                                                                  

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const changeLanguage = import(/* webpackChunkName: 'mutations' */ './graphql/mutation/update-language.graphql')
    this.changeLanguage = changeLanguage.then(changeLanguage => new GraphQLMutation(changeLanguage.default))
  }

  send(variables                         )                                     {
    return from(this.changeLanguage)
      .pipe(
        flatMap(req => req.send(variables)),
        map(response => response.state === 'retrieved'
          ? { state: 'retrieved', value: response.value.updateSettings.language }
          : response
        )
      )
  }
}
