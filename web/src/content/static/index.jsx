/* @flow */
import * as React from 'react'
import { TermsOfService } from './terms-of-service'
import { PrivacyPolicy } from './privacy-policy'

export type Props = {
  name: 'static',
  content: 'terms-of-service' | 'privacy-policy',
}

export function Static({ content }: Props) {
  switch (content) {
    case 'terms-of-service': return <TermsOfService />
    case 'privacy-policy':   return <PrivacyPolicy />
    default: return null
  }
}
