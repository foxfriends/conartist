/*       */
import * as React from 'react'
import { Row } from '../../common/table/row'
import { Vote } from '../../common/vote'
import { l } from '../../localization'
import { newlinesToReact } from '../../util/newlines-to-react'
import * as update from '../../update/suggestions'
                                                        
import S from './suggestion-item.css'

                     
                         
 

export function SuggestionItem({ suggestion: { id, suggestion, ranking, voted } }       ) {
  const vote = <Vote className={S.vote} vote={voted ? 1 : 0} upvotes={ranking} downvotes={null} onChange={() => update.voteForSuggestion(id)} />
  return (
    <Row className={S.item} title={newlinesToReact(suggestion)} detail={vote} />
  )
}
