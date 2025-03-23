/*       */
                                                       

                           
                     
             
                     
                    
                 
                  
                 
             
  

export function parse({ id, suggester: { name }, suggestion, suggestedAt: time, status, voted, ranking }                    )         {
  return {
    name: 'suggestion',
    id,
    suggestion,
    suggester: name,
    status,
    ranking,
    voted,
    time,
  }
}
