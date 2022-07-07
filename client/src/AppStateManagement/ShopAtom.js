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

export const prevPaymentPathState = atom({
    key:'prev_Payment_Page_State',
    default:'/',
})

export const totalPriceState = atom({
    key:'total_Price_State',
    default: 0
})