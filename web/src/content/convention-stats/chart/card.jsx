/* @flow */
import * as React from 'react'
import { Card } from '../../card-view/card'
import { BasicHeader } from '../../card-view/basic-header'
import { IconButton } from '../../../common/icon-button'
import S from './card.css'

export type Props = {
  title: string,
  children: [React.Node, React.Node],
  showSettings: (React.Node) => void,
  // $FlowIgnore
  innerRef?: React.Ref<HTMLDivElement>,
}

export function ChartCard({ children, title, showSettings, innerRef }: Props) {
  const [content, settings] = children
  return (
    <Card innerRef={innerRef}>
      <>
        <BasicHeader>{ title }</BasicHeader>
        <IconButton className={S.rightAction} title='settings' action={() => showSettings(settings)} priority='primary' />
      </>
      <>
        {content}
      </>
    </Card>
  )
}

ChartCard.height = 600;
ChartCard.width = 600 - 64;
