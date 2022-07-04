import { atom } from "recoil";

export const basketState = atom({
    key:'basket_State',
    default:[],
    dangerouslyAllowMutability:true,
})

export const isShowPopupBasketState = atom({
    key:'is_Show_Popup_Basket_State',
    default:false
})