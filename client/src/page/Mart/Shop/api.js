import Firebase from "../../../Firebase/FirebaseConfig"
export async function getAllShop(){
    let result = await Firebase.firestore().collection('daisonet.com').get();
    console.log(result.docs)
}