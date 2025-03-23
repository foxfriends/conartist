/*       */

                      
               
                   
                                                       
 

                                      

export const Storage = new class Storage {
  Auth   
  Localization   
  Language   

  constructor() {
    this.Auth = 'Auth'
    this.Localization = 'Localization'
    this.Language = 'Language'
  }

  storeTemp               (key   , value                                ) {
    sessionStorage.setItem(key, JSON.stringify(value))
  }

  store               (key   , value                                ) {
    if (sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  retrieve               (key   )                                  {
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

  remove(key            ) {
    sessionStorage.removeItem(key)
    localStorage.removeItem(key)
  }
}
