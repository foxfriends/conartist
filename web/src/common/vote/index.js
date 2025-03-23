/*       */
import * as React from 'react'
import { IconButton } from '../icon-button'
import S from './index.css'

                     
                     
                 
                  
                     
                              
 

export function Vote({ className, vote, upvotes, downvotes, onChange }       ) {
  let voteClass = ''
  if (vote === 1) {
    voteClass = S.up
  } else if (vote === -1) {
    voteClass = S.down
  }

  return (
    <div className={`${S.container} ${className || ''}`}>
      <div className={S.thumbs}>
        { downvotes === null ? null :
          <IconButton quiet priority='secondary' title='thumb_down' className={`${S.thumbDown} ${voteClass}`} action={() => onChange && onChange(vote === -1 ? 1 : -1)} />
        }
        <IconButton quiet priority='secondary' title='thumb_up' className={`${downvotes === null ? S.thumb : S.thumbUp} ${voteClass}`} action={() => onChange && onChange(vote === 1 ? -1 : 1)}/>
      </div>
      <span className={S.score}>{(upvotes || 0) - (downvotes || 0)}</span>
    </div>
  )
}
