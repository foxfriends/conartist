/* @flow */
import * as React from 'react'
import { Static } from './static'
import { Dashboard } from './dashboard'
import { Products } from './products'
import { EditProducts } from './edit-products'
import { EditPrices } from './edit-prices'
import { Prices } from './prices'
import { Conventions } from './conventions'
import { SearchConventions } from './search-conventions'
import { ConventionDetails } from './convention-details'
import { ConventionRecords } from './convention-records'
import { ConventionStats } from './convention-stats'
import { ConventionUserInfo } from './convention-user-info'
import { Admin } from './admin'
import { Settings } from './settings'
import type { Props as DashboardProps } from './dashboard'
import type { Props as ProductsProps } from './products'
import type { Props as EditProductsProps } from './edit-products'
import type { Props as PricesProps } from './prices'
import type { Props as EditPricesProps } from './edit-prices'
import type { Props as ConventionsProps } from './conventions'
import type { Props as SearchConventionsProps } from './search-conventions'
import type { Props as ConventionDetailsProps } from './convention-details'
import type { Props as ConventionUserInfoProps } from './convention-user-info'
import type { Props as ConventionRecordsProps } from './convention-records'
import type { Props as ConventionStatsProps } from './convention-stats'
import type { Props as StaticProps } from './static'
import type { Props as AdminProps } from './admin'
import type { Props as SettingsProps } from './settings'
import S from './index.css'

// TODO: these are just used for placeholder
import { l } from '../localization'
import { CardView } from './card-view'
import { Card } from './card-view/card'

export type Props
  = { name: 'placeholder' }
  | DashboardProps
  | EditProductsProps
  | ProductsProps
  | PricesProps
  | EditPricesProps
  | ConventionsProps
  | SearchConventionsProps
  | ConventionDetailsProps
  | ConventionRecordsProps
  | ConventionStatsProps
  | ConventionUserInfoProps
  | SettingsProps
  | StaticProps
  | AdminProps

export function Content(props: Props) {
  let content: React.Node
  switch (props.name) {
    case 'placeholder':
      content =
        <CardView>
          <Card className={S.emptyState}>
            <div className={S.placeholder}>
              {l`This page is coming soon!`}
            </div>
          </Card>
        </CardView>
      break
    case 'static':
      content = <Static {...props} />
      break
    case 'dashboard':
      content = <Dashboard {...props} />
      break
    case 'products':
      content = <Products {...props} />
      break
    case 'edit-products':
      content = <EditProducts {...props} />
      break
    case 'prices':
      content = <Prices {...props} />
      break
    case 'edit-prices':
      content = <EditPrices {...props} />
      break
    case 'conventions':
      content = <Conventions {...props} />
      break
    case 'search-conventions':
      content = <SearchConventions {...props} />
      break
    case 'convention-details':
      content = <ConventionDetails {...props} />
      break
    case 'convention-user-info':
      content = <ConventionUserInfo {...props} />
      break
    case 'convention-records':
      content = <ConventionRecords {...props} />
      break
    case 'convention-stats':
      content = <ConventionStats {...props} />
      break
    case 'settings':
      content = <Settings {...props} />
      break
    case 'admin':
      content = <Admin {...props} />
      break
  }
  return (
    <main className={S.container}>
      { content }
    </main>
  )
}
