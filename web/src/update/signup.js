/*       */
import { model } from '../model'
import { dashboard } from '../model/page'
                                                  

export function progressToNextStep(step       ) {
  if (step) {
    const { dialog, ...modelValue } = model.getValue()
    if (step.name === 'signed-in') {
      model.next({
        ...modelValue,
        dialog: null,
        page: dashboard,
      })
    } else {
      model.next({
        ...modelValue,
        // $FlowIgnore: Flow is not smart enough for the union type
        dialog: {
          ...dialog,
          step,
        }
      })
    }
  } else {
    model.next({
      ...model.getValue(),
      dialog: null,
    })
  }
}
