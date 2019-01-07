/* @flow */
import * as React from 'react'

import { l, lx } from '../../localization'
import { Form } from '../form'
import { Link } from '../../common/link'
import { Checkbox } from '../../common/checkbox'
import { TermsOfService } from '../../content/static/terms-of-service'
import { PrivacyPolicy } from '../../content/static/privacy-policy'
import type { Props as FormProps } from '../form'
import type { Validation as InputValidation } from '../../common/input'
import type { FormDelegate as Props } from './index'
import S from '../form.css'
import SS from './terms.css'

const URLS = [ '/terms', '/privacy' ]
function link(text: string, i: number): React.Node {
  return <Link href={URLS[i]} target="_blank">{ text }</Link>
}

export function TermsForm({ onValidate, onChange }: Props) {
  function handleChange(value) {
    onValidate(value)
    onChange(`${value ? 'true' : 'false'}`)
  }
  return (
    <div className={SS.terms}>
      <div className={S.question}>
        { l`Now just sign at the bottom.` }
      </div>
      <div className={SS.scrollbox}>
        <section>
          <TermsOfService />
        </section>
        <section>
          <PrivacyPolicy />
        </section>
      </div>
      <Checkbox onChange={handleChange} className={SS.checkbox}>
        {lx`I have read and agree to the {Terms of Service} and {Privacy Policy}`(link)}
      </Checkbox>
    </div>
  )
}
