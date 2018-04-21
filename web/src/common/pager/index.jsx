/* @flow */
import * as React from 'react'

import S from './index.css'

export type Props = {
  page: number,
  pages: number,
}

export function Pager({ page, pages }: Props) {
  const dots = []
  for (let i = 0; i < pages; ++i) {
    dots.push(<div className={`${S.dot} ${i === page ? S.current : ''}`} key={`pager_dot_${i}`}/>)
  }
  return (
    <div className={S.pager}>
      { dots }
    </div>
  )
}
