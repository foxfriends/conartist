/*       */
                                                   

                     
                      
                    
 

                                                                                         

                    
               
 

                     
                
                   
 

                        
                   
                   
                
 

                     
                
                   
                
                   
 

                         
                    
                   
                
                   
 

                        
                    
                    
 

const nameStep       = {
  name: 'name',
  next(username        ) { return emailStep.call(this, username) },
  previous: () => null,
}

export const signup         = {
  name: 'signup',
  step: nameStep,
}

function emailStep(username        )        {
  return {
    name: 'email',
    username,
    next(email        ) { return passwordStep.call(this, email) },
    previous() { return nameStep },
  }
}

function passwordStep(email        )        {
  return {
    name: 'password',
    username: this.username,
    email,
    next(password        ) { return termsStep.call(this, password) },
    previous() { return emailStep.call(this, this.username) },
  }
}

function termsStep(password        )        {
  return {
    name: 'terms',
    username: this.username,
    email: this.email,
    password,
    next() { return completedStep.call(this) },
    previous() { return passwordStep.call(this, this.email) },
  }
}

function completedStep()        {
  return {
    name: 'completed',
    username: this.username,
    email: this.email,
    password: this.password,
    next(authtoken        )        {
      return { 
        name: 'signed-in',
        authtoken,
      }
    },
    previous: () => null,
  }
}
