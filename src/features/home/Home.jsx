import React, { useReducer } from 'react';  
import {useTitle} from "@hooks/useTitle"

const initialState = { count: 0 };  

function reducer(state, action) {  
  switch (action.type) {  
    case 'increment': return { count: state.count + 1 };  
    case 'decrement': return { count: state.count - 1 };  
    default: return state;  
  }  
}

export default function BasketForm() {

  useTitle("خانه");
  
  const [state, dispatch] = useReducer(reducer, initialState);

  return (  
    <div>        
      <p>تعداد: {state.count}</p>  
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>  
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button> 
    </div> 
  )
}
