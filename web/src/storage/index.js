/* @flow */

type StorageScheme = {
  Auth: string,
  Language: string,
  Localization: { [string]: string | { web: string } },
}

type StorageKey = $Keys<StorageScheme>

export const Storage = new class Storage {
  Auth: *
  Localization: *
  Language: *

  constructor() {
    this.Auth = 'Auth'
    this.Localization = 'Localization'
    this.Language = 'Language'
  }

  storeTemp<K: StorageKey>(key: K, value: $ElementType<StorageScheme, K>) {
    sessionStorage.setItem(key, JSON.stringify(value))
  }

  store<K: StorageKey>(key: K, value: $ElementType<StorageScheme, K>) {
    if (sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  retrieve<K: StorageKey>(key: K): ?$ElementType<StorageScheme, K> {
    try {
      let value = localStorage.getItem(key)
      if (value === null || value === undefined) {
        value = sessionStorage.getItem(key)
        if (value === null || value === undefined) {
          return null
        }
      }
      return JSON.parse(value)
    } catch (error) {
      return null
    }
  }

  remove(key: StorageKey) {
    sessionStorage.removeItem(key)
    localStorage.removeItem(key)
  }
}
