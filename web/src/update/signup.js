/* @flow */
import { model } from '../model'
import type { Step } from '../model/dialog/signup'

export function progressToNextStep(step: ?Step) {
  if (step) {
    const { dialog, ...modelValue } = model.getValue()
    model.next({
      ...modelValue,
      // $FlowIgnore: Flow is not smart enough for the union type
      dialog: {
        ...dialog,
        step,
      }
    })
  } else {
    model.next({
      ...model.getValue(),
      dialog: null,
    })
  }
}
