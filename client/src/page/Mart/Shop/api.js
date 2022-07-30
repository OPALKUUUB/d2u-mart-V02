import Firebase from "../../../Firebase/FirebaseConfig";

export async function getAllCategory(shopName) {
  let result = await Firebase.firestore().collection(shopName).get();
  return result.docs;
}

export async function getItemInCategory(shopName, category) {
  let resultTruncateItems = await Firebase.firestore()
    .collection(shopName)
    .doc(category)
    .collection("items")
    .get();
  let itemList = [];
  for (let i = 0; i < resultTruncateItems.docs.length; i++) {
    let truncateList = resultTruncateItems.docs[i].data();
    for (
      let itemIndex = 0;
      itemIndex < truncateList?.items?.length;
      itemIndex++
    ) {
      let newItem = {};
      if (shopName === "daisonet.com") {
        newItem.id = truncateList?.items[itemIndex].id;
        newItem.image_url = truncateList?.items[itemIndex].image_url;
        newItem.price =
          "￥" + truncateList?.items[itemIndex].price.replace("円", "");
        newItem.name = truncateList?.items[itemIndex].name;
      }
      if (shopName === "www.abc-mart.net") {
        newItem.id = truncateList?.items[itemIndex].id;
        newItem.image_url = truncateList?.items[itemIndex].image;
        newItem.name = truncateList?.items[itemIndex].name;
        let price = truncateList?.items[itemIndex]?.price.split("(税込)");
        if (price.length > 2) {
          newItem.price = price[1];
        } else {
          newItem.price = price[0];
        }
      }

      itemList.push(newItem);
    }
  }
  console.log(itemList);
  return itemList;
}
