const loginUser = (user) =>{
    console.log('Acion' , user);
    
    return { 
        type : "LOGIN_USER",
        user
    }
} 
export {
    loginUser,
    // logoutUser
}