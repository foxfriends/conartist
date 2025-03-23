/*       */
import * as React from 'react'

import { Table } from '../../common/table'
import { Icon } from '../../common/icon'
import { Font } from '../../common/font'
import { Link } from '../../common/link'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { DatesInfo } from './info/dates'
import { HoursInfo } from './info/hours'
import { WebsiteInfo } from './info/website'
import { MoneyInfo } from './info/money-info'
import { AddressInfo } from './info/address'
import { l, lx } from '../../localization'
import * as navigate from '../../update/navigate'
                                                        

import S from './card.css'
const { Fragment } = React

                     
                         
                        
 

export function TodayConventionCard({ convention, showDetails }       ) {
  return (
    <Card>
      <BasicHeader>
        <span>
          {lx`{${convention.name}} {is today. Good luck!}`(text => text === convention.name ? text : <Font smallCaps regular>{ text }</Font>)}
        </span>
        { showDetails ? <Link className={S.detailsButton} priority='tertiary' onClick={() => navigate.conventionDetails(convention)}><Font smallCaps>{l`Details`}</Font><Icon name='keyboard_arrow_right' /></Link> : null }
      </BasicHeader>
      <Table>
        <DatesInfo start={convention.start} end={convention.end} />
        <HoursInfo todayOnly infos={convention.extraInfo} />
        <AddressInfo infos={convention.extraInfo} />
        <WebsiteInfo infos={convention.extraInfo} />
        <MoneyInfo hideZero title={l`Current earnings`} amount={convention.recordTotal} />
      </Table>
    </Card>
  )
}
