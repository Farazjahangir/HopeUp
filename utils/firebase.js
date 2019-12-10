import firebaseLib from "react-native-firebase";

const firebaseFunctions = {};

const auth = firebaseLib.auth()
const db = firebaseLib.firestore()

firebaseFunctions.signUpWithEmail = async (email , password) => {
    try{
        const authResponse = await auth.createUserWithEmailAndPassword(email, password)
        const userId = authResponse.user.uid        
        const userObj = {
            userId,
            email
        }
       await firebaseFunctions.setDocument('Users' , userId , userObj)
        return userObj
    }
    catch(e){
        throw { message: e.message }
    }
}

firebaseFunctions.setDocument = (collection, docId, data) => {
    return db.collection(collection).doc(docId).set(data)
}

export default firebaseFunctions