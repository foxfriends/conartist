/* @flow */
import * as React from 'react'
import formatDate from 'date-fns/format'

import { BasicCard } from '../card-view/basic-card'
import { Grid } from '../../common/grid'
import { Row } from '../../common/table/row'
import { Font } from '../../common/font'
import { Button } from '../../common/button'
import { Link } from '../../common/link'
import { l, lx } from '../../localization'
import * as navigate from '../../update/navigate'
import type { Convention } from '../../model/convention'
import S from './coming-soon-conventions-card.css'

export type Props = {
  conventions: Convention[],
}

function format(date: Date): string {
  return formatDate(date, l`MMM. d, yyyy`)
}

function bold(text): React.Node {
  return <Font semibold>{ text }</Font>
}

export function ComingSoonConventionsCard({ conventions }: Props) {
  return (
    <BasicCard title={<Font smallCaps regular>{(conventions.length === 1 ? lx`{1} convention coming soon.` : lx`{${conventions.length}} conventions coming soon.`)(bold)}</Font>}>
      { conventions.length === 0
        ? <div className={S.placeholder}>
            <Button action={navigate.searchConventions}>{l`Find more`}</Button>
          </div>
        : <>
            <Grid columns='1fr 1fr 0'>
                {conventions
                  .map(convention =>
                    <Row
                      title={convention.name}
                      value={l`${format(convention.start)} - ${format(convention.end)}`}
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
