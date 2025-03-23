/*       */
import * as React from 'react'
import formatDate from 'date-fns/format'

import { l } from '../../localization'
import { Item } from '../../common/list/item'
import { Font } from '../../common/font'
import { model } from '../../model'
                                                  
import S from './item.css'

                     
                   
                
                                       
                      
 

function format(date      )         {
  return formatDate(date, l`h:mm`)
}

export function ExpenseItem({ expense, onClick, innerRef }       ) {
  return (
    <Item onClick={onClick}>
      <div className={`${S.item} ${S.expense}`} ref={innerRef}>
        <div className={S.info}>
          <div className={S.category}>{expense.category}</div>
          <div className={S.time}>{format(expense.time)}</div>
        </div>
        <div className={S.amount}>
          ({expense.price.toString()})
        </div>
      </div>
    </Item>
  )
}
