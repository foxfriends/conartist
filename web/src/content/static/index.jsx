/* @flow */
import * as React from 'react'
import { TermsOfService } from './terms-of-service'
import { PrivacyPolicy } from './privacy-policy'
import { Splash } from './splash'

export type Props = {
  name: 'static',
  content: 'terms-of-service' | 'privacy-policy' | 'splash',
}

export function Static({ content }: Props) {
  switch (content) {
    case 'terms-of-service': return <TermsOfService />
    case 'privacy-policy':   return <PrivacyPolicy />
    case 'splash':           return <Splash />
    default: return null
  }
}
