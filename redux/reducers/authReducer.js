const reducer = (state = {}, action) =>{
    console.log('Reducer' , action);
    
    switch(action.type) {
        case "LOGIN_USER": {
            return {...state, user: action.user}
        }
        // case "LOGOUT_USER" : {
        //     return {...state , user : null}
        // }
        default: {
            return state;
        }
    }
}

export default reducer;