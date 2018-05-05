/* @flow */
import { model } from '../model'
import { StarConvention } from '../api/star-convention'
import { UnstarConvention } from '../api/unstar-convention'
import type { Convention } from '../model/convention'
import type { MetaConvention } from '../model/meta-convention'

export async function starConvention(convention: MetaConvention) {
  const { conventions, ...existingModel } = model.getValue()
  if (conventions.find(({ id }) => id === convention.id)) {
    return
  }
  model.next({
    ...existingModel,
    conventions: [...conventions, convention],
  })
  try {
    const response = await new StarConvention().send({ conId: convention.id }).toPromise()
    if (response.state !== 'retrieved') {
      throw new Error();
    }
    const newConvention = response.value
    model.next({
      ...model.getValue(),
      conventions: [...conventions, newConvention],
    })
  } catch(error) {
    model.next({
      ...model.getValue(),
      conventions
    })
  }
}

export async function unstarConvention(convention: MetaConvention) {
  const { conventions: originalConventions, ...existingModel } = model.getValue()
  const conventions = [...originalConventions];
  const index = conventions.map(({ id }) => id).indexOf(convention.id)
  if (index === -1) {
    return
  }
  conventions.splice(index, 1)
  model.next({
    ...existingModel,
    conventions,
  })
  try {
    const response = await new UnstarConvention().send({ conId: convention.id }).toPromise()
    if (response.state !== 'retrieved') {
      throw new Error();
    }
  } catch(error) {
    model.next({
      ...model.getValue(),
      conventions: originalConventions,
    })
  }
}

export function setConvention(convention: Convention) {
  const { conventions: originalConventions, page: originalPage } = model.getValue()
  // $FlowIgnore: flow can't do this
  const page = { ...originalPage }
  switch (page.name) {
    case 'convention-details':
    case 'convention-user-info':
    case 'convention-stats':
    case 'convention-records':
      if (page.convention.id === convention.id) {
        page.convention = convention
      }
      break
  }
  const conventions = [...originalConventions].map(oldCon => oldCon.id === convention.id ? convention : oldCon)
  model.next({
    ...model.getValue(),
    // $FlowIgnore: flow is confused about enums
    conventions,
    // $FlowIgnore: flow is confused about enums again
    page,
  })
}
