import firebaseLib from "react-native-firebase";

const firebaseFunctions = {};

const auth = firebaseLib.auth()
const db = firebaseLib.firestore()

firebaseFunctions.signUpWithEmail = async (email , password , userName) => {
    try{
        const authResponse = await auth.createUserWithEmailAndPassword(email, password)
        const userId = authResponse.user.uid        
        const userObj = {
            userName,
            userId,
            email,
            followers: [],
            following: []
        }
       await firebaseFunctions.setDocument('Users' , userId , userObj)
       userObj.userId = userId
        return userObj
    }
    catch(e){
        throw e
    }
}

firebaseFunctions.signInWithEmail = async (email , password) => {
    try{
        const authResponse = await auth.signInWithEmailAndPassword(email, password)
        return authResponse
    }
    catch(e){
        throw {message : e.message}
    }
}

firebaseFunctions.setDocument = (collection, docId, data) => {
    return db.collection(collection).doc(docId).set(data)
}

firebaseFunctions.addDocument = async (collection, data) => {
    try{
        const response = await db.collection(collection).add(data)
        return response
    }
    catch(e){
        return e
    }
}

firebaseFunctions.getDocument = async (collection, docId ) => {
    try{
        console.log("try")
        const dbResponse = await db.collection(collection).doc(docId).get()
        return dbResponse
    }
    catch(e){
        console.log('Error' , e);
        
        throw e
    }
}

firebaseFunctions.getCollection = async collection => {
    try{
        const usersArr = []
        const querySnapshot = await db.collection(collection).get()
        querySnapshot.forEach(doc => usersArr.push(doc.data()))
        return usersArr
    }
    catch(e){
        alert(e.message)
    }
}

export default firebaseFunctions