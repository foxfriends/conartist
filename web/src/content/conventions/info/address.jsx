/* @flow */
import * as React from 'react'
import { l } from '../../../localization'
import { Row } from '../../../common/table/row'
import { Font } from '../../../common/font'
import { newlinesToReact } from '../../../util/newlines-to-react'
import type { ConventionExtraInfo } from '../../../model/convention-extra-info'

export type Props = {
  infos: ConventionExtraInfo[],
}

export function AddressInfo({ infos }: Props) {
  try {
    const addressInfo = infos.find(({ title }) => title === 'Address')
    if (addressInfo && addressInfo.info && addressInfo.action) {
      const { info, action } = addressInfo
      const address = newlinesToReact(JSON.parse(info))
      const coordsURL = action
      return <Row tall title={<Font smallCaps>{l`Address`}</Font>} value={address} />
    }
  } catch(_) {}
  return null
}
