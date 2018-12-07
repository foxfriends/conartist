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

  store<K: StorageKey>(key: K, value: $ElementType<StorageScheme, K>) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  retrieve<K: StorageKey>(key: K): ?$ElementType<StorageScheme, K> {
    try {
      const value = localStorage.getItem(key)
      if (value === null || value === undefined) {
        return null
      }
      return JSON.parse(value)
    } catch (error) {
      return null
    }
  }

  remove(key: StorageKey) {
    localStorage.removeItem(key)
  }
}
