const input = document.createElement('input')
input.setAttribute('type', 'file')

let rejectPreviousDialog = null

export function getFile({ accept = '' }) {
  rejectPreviousDialog && rejectPreviousDialog()
  return new Promise((resolve, reject) => {
    rejectPreviousDialog = () => reject(new Cancelled())
    input.setAttribute('accept', accept)
    input.click()
    input.onchange = () => {
      const file = input.files[0]
      resolve(file)
      rejectPreviousDialog = null
    }
  })
}

export function fileToString(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.readAsText(file);
    fr.onload = () => resolve(fr.result)
    fr.onerror = error => {
      reject(error)
      fr.abort()
    }
  })
}

export class Cancelled extends Error {}
