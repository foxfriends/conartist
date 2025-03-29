import { model } from "../model";
import { VoteForInfo } from "../api/vote-for-info";
import { ContributeConventionInfo } from "../api/contribute-convention-info";

function addInfo(convention, info) {
  return {
    ...convention,
    userInfo: [...convention.userInfo, info],
  };
}

export async function addUserInfo(convention, info) {
  try {
    const response = await new ContributeConventionInfo()
      .send({ conId: convention.id, info })
      .toPromise();
    if (response.state !== "retrieved") {
      throw new Error();
    }
    const { value: newInfo } = response;
    const {
      page: { ...page },
      conventions: originalConventions,
    } = model.getValue();
    const conventions = [...originalConventions].map((con) =>
      con.id === convention.id ? addInfo(con, newInfo) : con,
    );
    switch (page.name) {
      case "convention-user-info":
      case "convention-details":
      case "convention-stats":
      case "convention-records":
        if (page.convention.id === convention.id) {
          page.convention = addInfo(page.convention, newInfo);
        }
        break;
    }
    model.next({
      ...model.getValue(),
      conventions,
      page,
    });
  } catch (_) {}
}

function adjustVotes(id, vote) {
  return (info) =>
    id === info.id
      ? // $FlowIgnore: flow doesn't like exact types
        {
          ...info,
          upvotes: info.upvotes - Math.max(info.vote, 0) + Math.max(vote, 0),
          downvotes:
            info.downvotes - Math.max(-info.vote, 0) + Math.max(-vote, 0),
          vote,
        }
      : info;
}

export async function voteForInfo(id, vote) {
  const { conventions: originalConventions, page: originalPage } =
    model.getValue();
  const page = { ...originalPage };
  switch (page.name) {
    case "convention-details":
    case "convention-user-info":
    case "convention-stats":
    case "convention-records":
      page.convention.userInfo = page.convention.userInfo.map(
        adjustVotes(id, vote),
      );
      break;
  }
  const conventions = [...originalConventions].map((convention) => ({
    ...convention,
    userInfo: convention.userInfo.map(adjustVotes(id, vote)),
  }));
  model.next({
    ...model.getValue(),
    // $FlowIgnore: flow is confused about enums
    conventions,
    // $FlowIgnore: flow is confused about enums again
    page,
  });
  try {
    const response = await new VoteForInfo().send({ id, vote }).toPromise();
    if (response.state === "failed") {
      throw new Error();
    }
  } catch (_) {
    model.next({
      ...model.getValue(),
      conventions: originalConventions,
      page: originalPage,
    });
  }
}
