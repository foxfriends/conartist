/* @flow */
import * as React from 'react'

import LOGO from '../../../icons/apple-icon-180x180.png'
import { l, lx } from '../../localization'
import { Form } from './form'
import { Link } from '../../common/link'
import { Checkbox } from '../../common/checkbox'
import { TermsOfService } from '../../content/static/terms-of-service'
import { PrivacyPolicy } from '../../content/static/privacy-policy'
import type { Props as FormProps } from './form'
import type { Validation as InputValidation } from '../../common/input'
import type { FormDelegate as Props } from './index'
import S from './form.css'

const URLS = [ '/terms-of-service', '/privacy-privacy' ]
function link(text: string, i: number): React.Node {
  return <Link href={URLS[i]} target="_blank">{ text }</Link>
}

export function TermsForm({ onValidate, onChange }: Props) {
  function handleChange(value) {
    onValidate(value)
    onChange(`${value ? 'true' : 'false'}`)
  }
  return (
    <Form image={LOGO}>
      <div className={S.question}>
        { l`Now just sign at the bottom.` }
      </div>
      <div className={S.scrollbox}>
        <section>
          <TermsOfService />
        </section>
        <section>
          <PrivacyPolicy />
        </section>
      </div>
      <Checkbox onChange={handleChange} className={S.checkbox}>
        {lx`I have read and agree to the {Terms of Service} and {Privacy Policy}`(link)}
      </Checkbox>
    </Form>
  )
}
