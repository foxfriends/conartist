/* @flow */
import * as React from 'react'

import { Button } from '../common/button'
import { Pager } from '../common/pager'
import type { Props as ButtonProps } from '../common/button'
import type { Props as PagerProps } from '../common/pager'

import S from './basic.css'

export type Props = {
  title: string,
  onContinue?: ButtonProps,
  onBack?: ButtonProps,
  pager?: PagerProps,
  children?: React.Node,
}

export function Basic({ title, onContinue, onBack, pager, children }: Props) {
  return (
    <div className={S.dialog}>
      <header className={S.header}>
        { title }
      </header>
      <div className={S.contents}>
        { children }
      </div>
      <footer className={S.footer}>
        { onBack ? <Button className={S.footerButton} {...onBack} /> : <span /> }
        { pager ? <Pager {...pager} /> : <span /> }
        { onContinue ? <Button className={S.footerButton} {...onContinue} /> : null }
      </footer>
    </div>
  )
}
