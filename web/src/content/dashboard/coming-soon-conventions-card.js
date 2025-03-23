/*       */
import * as React from 'react'
import formatDate from 'date-fns/format'

import { toLocal } from '../../util/date'
import { BasicCard } from '../card-view/basic-card'
import { Grid } from '../../common/grid'
import { Row } from '../../common/table/row'
import { Font } from '../../common/font'
import { Button } from '../../common/button'
import { Link } from '../../common/link'
import { l, lx } from '../../localization'
import { by, Asc } from '../../util/sort'
import * as navigate from '../../update/navigate'
                                                        
import S from './coming-soon-conventions-card.css'

                     
                            
 

function format(date      )         {
  return formatDate(date, l`MMM. d, yyyy`)
}

function bold(text)             {
  return <Font semibold>{ text }</Font>
}

export function ComingSoonConventionsCard({ conventions }       ) {
  return (
    <BasicCard title={<Font smallCaps regular>{(conventions.length === 1 ? lx`{1} convention coming soon.` : lx`{${conventions.length}} conventions coming soon.`)(bold)}</Font>}>
      { conventions.length === 0
        ? <div className={S.placeholder}>
            <Button action={navigate.searchConventions}>{l`Find more`}</Button>
          </div>
        : <>
            <Grid columns='1fr 1fr 0'>
              {[...conventions]
                .sort(by(['start', Asc], ['end', Asc]))
                .map(convention =>
                  <Row
                    title={convention.name}
                    value={l`${format(toLocal(convention.start))} - ${format(toLocal(convention.end))}`}
                    detail={<Link className={S.view} onClick={() => navigate.conventionDetails(convention)}>{l`View`}</Link>}
                    key={`convention_${convention.id}`}
                    />
                  )
              }
            </Grid>
            <div className={S.findMore}><Link onClick={navigate.searchConventions}>{l`Find more`}</Link></div>
          </>
      }
    </BasicCard>
  )
}
