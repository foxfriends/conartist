/*       */
import * as React from 'react'
import formatDate from 'date-fns/format'

import { List } from '../../common/list'
import { Link } from '../../common/link'
import { Icon } from '../../common/icon'
import { Font } from '../../common/font'
import { Item } from '../../common/list/item'
import { l } from '../../localization'
import { SecondaryCard } from '../card-view/secondary-card'
import * as dialog from '../../update/dialog'
                                                  
import S from './info.css'

                     
                   
                
                                 
                      
 

function format(date      )         {
  return formatDate(date, l`h:mma`)
}

export function ExpenseInfo({ expense, anchor, onClose }       ) {
  const editExpense = () => {
    dialog.showNewExpenseDialog(expense)
    onClose()
  }
  const title = (
    <><Link onClick={editExpense}><Icon className={S.editIcon} name='edit' /></Link> {l`Expense`}</>
  )
  return (
    <SecondaryCard title={title} anchor={anchor} onClose={onClose}>
      <List>
        <Item className={S.info}>
          <Font smallCaps semibold>{l`Category`}</Font>
          <span>{ expense.category }</span>
        </Item>
        <Item className={S.info}>
          <Font smallCaps semibold>{l`Price`}</Font>
          { expense.price.toString() }
        </Item>
        <Item className={S.info}>
          <Font smallCaps semibold>{l`Time`}</Font>
          { format(expense.time) }
        </Item>
      </List>
      <div className={S.info}>
        <Font smallCaps semibold>{l`Note`}</Font>
        <div className={S.rule}/>
      </div>
      <div className={S.note}>{ expense.description || <span className={S.placeholder}>{l`Nothing to say...`}</span> }</div>
    </SecondaryCard>
  )
}
