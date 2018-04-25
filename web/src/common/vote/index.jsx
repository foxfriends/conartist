/* @flow */
import * as React from 'react'
import { IconButton } from '../icon-button'
import S from './index.css'

export type Props = {
  className?: string,
  vote?: ?number,
  upvotes: number,
  downvotes: number,
  onChange?: (number) => void,
}

export function Vote({ className, vote, upvotes, downvotes, onChange }: Props) {
  let voteClass = ''
  if (vote === 1) {
    voteClass = S.up
  } else if (vote === -1) {
    voteClass = S.down
  }

  return (
    <div className={`${S.container} ${className || ''}`}>
      <div className={S.thumbs}>
        <IconButton quiet priority='secondary' title='thumb_down' className={`${S.thumbDown} ${voteClass}`} action={() => onChange && onChange(vote === -1 ? 1 : -1)} />
        <IconButton quiet priority='secondary' title='thumb_up' className={`${S.thumbUp} ${voteClass}`} action={() => onChange && onChange(vote === 1 ? -1 : 1)}/>
      </div>
      <span className={S.score}>{upvotes - downvotes}</span>
    </div>
  )
}
