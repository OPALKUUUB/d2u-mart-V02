import Firebase from "../../../Firebase/FirebaseConfig"

export async function getAllCategory(shopName){
    let result = await Firebase.firestore().collection(shopName).get();
    return result.docs;
}

export async function getItemInCategory(shopName,category){
    let resultTruncateItems = await Firebase.firestore().collection(shopName).doc(category).collection('items').get();
    let itemList = [];
    for(let i = 0 ; i < resultTruncateItems.docs.length ; i++){
        let truncateList = resultTruncateItems.docs[i].data();
        for(let itemIndex = 0 ; itemIndex < truncateList?.items?.length ; itemIndex++){
            itemList.push(truncateList?.items[itemIndex])
        }
    }
    return itemList;
}
