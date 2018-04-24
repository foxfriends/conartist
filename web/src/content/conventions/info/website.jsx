/* @flow */
import * as React from 'react'
import { l } from '../../../localization'
import { Row } from '../../../common/table/row'
import { SmallCaps } from '../../../common/smallcaps'
import { Link } from '../../../common/link'
import { newlinesToReact } from '../../../util/newlines-to-react'
import type { ConventionExtraInfo } from '../../../model/convention-extra-info'

export type Props = {
  infos: ConventionExtraInfo[],
}

export function WebsiteInfo({ infos }: Props) {
  try {
    const websiteInfo = infos.find(({ title }) => title === 'Website')
    if (websiteInfo && websiteInfo.action && websiteInfo.actionText) {
      const { action: websiteURL, actionText: website } = websiteInfo
      return <Row title={<SmallCaps>{l`Website`}</SmallCaps>} value={<Link href={websiteURL} target='_blank'>{website}</Link>} />
    }
  } catch(_) {}
  return null
}
