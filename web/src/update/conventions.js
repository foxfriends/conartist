/* @flow */
import { model } from '../model'
import type { MetaConvention } from '../model/meta-convention'

export function starConvention(convention: MetaConvention) {
  const { conventions, ...existingModel } = model.getValue()
  if (conventions.find(({ id }) => id === convention.id)) {
    return
  }
  model.next({
    ...existingModel,
    conventions: [...conventions, convention],
  })
}

export function unstarConvention(convention: MetaConvention) {
  const { conventions: [...conventions], ...existingModel } = model.getValue()
  const index = conventions.map(({ id }) => id).indexOf(convention.id)
  if (index === -1) {
    return
  }
  conventions.splice(index, 1)
  model.next({
    ...existingModel,
    conventions,
  })
}
