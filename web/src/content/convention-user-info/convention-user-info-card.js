/* @flow */
import * as React from 'react'

import { AutoList as List } from '../../common/list/auto'
import { Vote } from '../../common/vote'
import { Item } from '../../common/list/item'
import { Link } from '../../common/link'
import { Font } from '../../common/font'
import { Icon } from '../../common/icon'
import { IconButton } from '../../common/icon-button'
import { Card } from '../card-view/card'
import { BasicHeader } from '../card-view/basic-header'
import { l, lx } from '../../localization'
import { by, Desc } from '../../util/sort'
import * as navigate from '../../update/navigate'
import * as update from '../../update/user-info'
import type { Convention } from '../../model/convention'
import S from './card.css'

const { Fragment } = React

export type Props = {
  convention: Convention,
  title?: string,
  limit?: number,
  hasSeeAllButton?: boolean
}

export class ConventionUserInfoCard extends React.Component<Props> {
  handleVoteChanged(id: number, vote: number) {
    update.voteForInfo(id, vote)
  }

  render() {
    const { title, limit, hasSeeAllButton, convention } = this.props

    const dataSource = [...convention.userInfo]
      .map(info => ({ ...info, score: info.upvotes - info.downvotes }))
      .sort(by(['score', Desc]))
      .slice(0, limit || convention.userInfo.length)

    return (
      <Card>
        <BasicHeader>
          { title ? <span>{title}</span> : <Font smallCaps>{l`Extra info`}</Font>}
          { hasSeeAllButton
              ? <Link
                  className={S.detailsButton}
                  priority='tertiary'
                  onClick={() => navigate.conventionUserInfo(convention)}
                  >
                  <Font smallCaps>{l`See all`}</Font>
                  <Icon name='keyboard_arrow_right' />
                </Link>
              : null
          }
        </BasicHeader>
        <List dataSource={dataSource}>
          <div className={S.placeholder}>
            {lx`<No convention user info>`(_ => _)}
          </div>
          {({ id, info, vote, upvotes, downvotes }, _) =>
            <Item className={S.item} key={`info_${id}`}>
              <span className={S.truncation}>{info}</span>
              <Vote className={S.vote} vote={vote} upvotes={upvotes} downvotes={downvotes} onChange={vote => this.handleVoteChanged(id, vote)} />
            </Item>
          }
        </List>
      </Card>
    )
  }
}
