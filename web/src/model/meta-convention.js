/* @flow */
import type { MetaConventionFragmentFragment } from '../api/schema'
import { Money } from './money'
import { parse as parseImage } from './convention-image'
import { parse as parseExtraInfo } from './convention-extra-info'
import { parse as parseUserInfo } from './convention-user-info'
import type { ConventionImage } from './convention-image'
import type { ConventionExtraInfo } from './convention-extra-info'
import type { ConventionUserInfo } from './convention-user-info'

export type MetaConvention = {|
  id: number,
  name: string,
  images: ConventionImage[],
  start: Date,
  end: Date,
  extraInfo: ConventionExtraInfo[],
  userInfo: ConventionUserInfo[],
  recordTotal: ?Money,
  expenseTotal: ?Money,
|}

export function parse({ id, name, images, start, end, extraInfo, userInfo, recordTotal, expenseTotal }: MetaConventionFragmentFragment): MetaConvention {
  return {
    id, 
    name, 
    images: images.map(parseImage),
    start: new Date(start),
    end: new Date(end),
    extraInfo: extraInfo.map(parseExtraInfo),
    userInfo: userInfo.map(parseUserInfo),
    recordTotal: recordTotal && new Money(recordTotal),
    expenseTotal: expenseTotal && new Money(expenseTotal),
  }
}
