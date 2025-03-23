/*       */
import * as React from 'react'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { Table } from '../../common/table'
import { Button } from '../../common/button'
import { Tooltip } from '../../common/tooltip'
import { Icon } from '../../common/icon'
import { Link } from '../../common/link'
import { Row } from './row'
import { ResendVerificationEmail } from '../../api/resend-verification-email'
import { l } from '../../localization'
import * as update from '../../update/settings'
import S from './settings.css'

                     
                
               
                    
 

export function AccountSettings({ email, name, verified }       ) {
  const emailIcon = verified
    ? <Icon className={S.verificationStatus} name='verified_user' />
    : (
      <Link onClick={() => new ResendVerificationEmail().send().subscribe()}>
        <Icon className={S.verificationStatus} name='warning' />
      </Link>
    )

  const verificationTitle = verified
    ? l`Your email is verified`
    : l`Your email is not verified! (Click to resend verification email)`

  const emailContent = (
    <span className={S.nowrap}>
      <Tooltip clickable={false} title={verificationTitle}>
        {emailIcon}
      </Tooltip>
      {email}
    </span>
  )

  return (
    <Card>
      <BasicHeader>
        {l`Account`}
        <Button className={S.headerButton} priority='secondary' title='Sign out' action={() => update.signOut()}>{l`Sign out`}</Button>
      </BasicHeader>
      <Table>
        <Row title={l`Email`} value={emailContent} onEdit={update.changeEmail} />
        <Row title={l`Name`} value={name} onEdit={update.changeName} />
        <Row title={l`Password`} onEdit={update.changePassword} />
      </Table>
    </Card>
  )
}
