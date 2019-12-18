const loginUser = (user) =>{
    console.log('Acion' , user);
    
    return { 
        type : "LOGIN_USER",
        user
    }
} 

const logoutUser = (user) =>{
    console.log('Acion' , user);
    
    return { 
        type : "LOGOUT_USER",
        user
    }
} 

export {
    loginUser,
    logoutUser
}