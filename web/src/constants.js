/* @flow */
export const LocalStorage = {
  Auth: 'ca:auth',
}

export const APIURL = process.env.API_URL
export const GraphQLURL = process.env.GRAPHQL_URL
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL
export const DONATE_URL = process.env.DONATE_URL
export const REPOSITORY_URL = process.env.REPOSITORY_URL
export const APP_STORE_URL = 'https://itunes.apple.com/us/app/conartist/id1448972207'
export const DISCORD_URL = 'https://discordapp.com/invite/kh9hmt3'

export const EMAIL_FORMAT = /^[^@]+@[^@]+\.[^@]+$/

export const MIN_PASSWORD_LENGTH = 8

export const LANGUAGES = ['en-ca', 'en-us'] // , 'zh-Hans']

export const CURRENCIES = ['CAD', 'USD', 'MXN']

export const PAGE_NO_AUTH = ['verify', 'reset-password', 'terms-of-service', 'privacy-policy', 'splash', 'faq']

export const RFC3339 = 'yyyy-MM-dd\'T\'hh:mm:ssXXX'
