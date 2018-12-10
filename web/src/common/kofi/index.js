import * as React from 'react'
import { l } from '../../localization'
import { Button } from '../button'
import { DONATE_URL } from '../../constants'
import S from './index.css'

function visitKofi() {
  const kofi = window.open(DONATE_URL, '_blank', 'noopener')
  if (kofi) { kofi.opener = null }
}

export function KofiButton({ className }) {
  return (
    <Button priority='primary' action={visitKofi} className={`${S.kofiButton} ${className || ''}`}>
      <img src='https://ko-fi.com/img/cuplogo.svg' className={S.kofiImage} /> {l`Support Us on Ko-fi`}
    </Button>
  )
}
