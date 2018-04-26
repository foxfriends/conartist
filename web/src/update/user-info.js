/* @flow */
import { model } from '../model'
import type { ConventionUserInfo } from '../model/convention-user-info'
import { VoteForInfo } from '../api/vote-for-info'

function adjustVotes(id: number, vote: number): (ConventionUserInfo) => ConventionUserInfo {
  return info => id === info.id
    ? {
        ...info,
        upvotes: info.upvotes - Math.max(info.vote, 0) + Math.max(vote, 0),
        downvotes: info.downvotes - Math.min(info.vote, 0) + Math.min(vote, 0),
        vote,
      }
    : info
}

export async function voteForInfo(id: number, vote: number) {
  const { conventions: originalConventions, page: originalPage } = model.getValue()
  const page = { ...originalPage }
  switch (page.name) {
    case 'convention-details':
    case 'convention-user-info':
      page.convention.userInfo = page.convention.userInfo.map(adjustVotes(id, vote))
      break
  }
  const conventions = [...originalConventions].map(convention => ({
    ...convention,
    userInfo: convention.userInfo.map(adjustVotes(id, vote))
  }))
  model.next({
    ...model.getValue(),
    conventions,
    page,
  })
  try {
    const response = await new VoteForInfo().send({ id, vote })
    if (response.state === 'failed') {
      throw new Error();
    }
  } catch(_) {
    model.next({
      ...model.getValue(),
      conventions: originalConventions,
      page: originalPage,
    })
  }
}
