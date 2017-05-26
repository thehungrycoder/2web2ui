export default (state = {}, action) => {
  
  switch(action.type) {
    case 'FETCH_ACCOUNT_SUCCESS':
      return action.payload;
      
    default:
      return state;
  }
  
}