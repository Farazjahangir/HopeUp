const loginUser = (user) =>{
    return { 
        type : "LOGIN_USER",
        user
    }
} 

const logoutUser = (user) =>{
    return { 
        type : "LOGOUT_USER",
        user
    }
} 

export {
    loginUser,
    logoutUser
}