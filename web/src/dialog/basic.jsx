/* @flow */
import * as React from 'react'

import { Icon } from '../common/icon'
import { Button } from '../common/button'
import { IconButton } from '../common/icon-button'
import { Pager } from '../common/pager'
import type { Props as ButtonProps } from '../common/button'
import type { Props as IconButtonProps } from '../common/icon-button'
import type { Props as PagerProps } from '../common/pager'

import S from './basic.css'

export type Props = {
  title: string,
  onContinue?: ?ButtonProps,
  onBack?: ?ButtonProps,
  onClose?: ?IconButtonProps,
  pager?: PagerProps,
  children?: React.Node,
}

export function Basic({ title, onContinue, onBack, onClose, pager, children }: Props) {
  return (
    <div className={S.dialog}>
      { onClose ? <IconButton {...onClose} priority="tertiary" className={S.closeButton} /> : null }
     <header className={S.header}>
        { title }
      </header>
      <div className={S.contents}>
        { children }
      </div>
      <footer className={S.footer}>
        {/* backwards using row-reverse so the tab index works as expected */}
        { onContinue ? <Button className={S.footerButton} {...onContinue} key='continuebutton' /> : <Button className={S.fakeButton} title='' action={() => {}} key='fakebutton_right' /> }
        { pager ? <Pager {...pager} /> : <span /> }
        { onBack ? <Button className={S.footerButton} {...onBack} key='backbutton'/> : <Button className={S.fakeButton} title='' action={() => {}} key='fakebutton_left'/> }
      </footer>
    </div>
  )
}
