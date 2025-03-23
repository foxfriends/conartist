/*       */
import * as React from 'react'
import { Row as DefaultRow } from '../../common/table/row'
import { l } from '../../localization'
import { Link } from '../../common/link'
import S from './settings.css'

                     
                
                 
                     
 

export function Row({ title, value, onEdit }       ) {
  const editButton = <Link onClick={onEdit} className={S.caps}>{l`Change`}</Link>
  const formattedValue = <span className={S.value}>{value || ''}</span>
  const formattedTitle = <span className={S.caps}>{title}</span>

  return (
    <DefaultRow truncate title={formattedTitle} value={formattedValue} detail={onEdit ? editButton : null} />
  )
}
