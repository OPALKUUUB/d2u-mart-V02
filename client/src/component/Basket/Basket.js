import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { useRecoilState } from "recoil";
import { basketState, isShowPopupBasketState } from "../../AppStateManagement/ShopAtom";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

function Basket() {
    const [ isShowPopupBasket , setIsShowPopupBasket ] = useRecoilState(isShowPopupBasketState);
    const [ itemInBasket , setItemInBasket ] = useRecoilState(basketState);
    const [ countItemInBasket , setCountItemInBasket ] = useState(0);
    const [ totalPrice , setTotalPrice ] = useState(0);
    
    useEffect(()=>{
        let oldBasketData = window.localStorage.getItem('d2u-mart-basket');
        oldBasketData = JSON.parse(oldBasketData);
        if(oldBasketData && oldBasketData.length > 0){
            setItemInBasket(oldBasketData);
        }
    },[])
    
    useEffect(()=>{
        let count = 0;
        let price = 0;
        itemInBasket.forEach((item)=>{
            price += Number(item.price.replace("￥","").replaceAll(",",''))*item.count;
            count += item.count;
        })
        setCountItemInBasket(count);
        setTotalPrice(price);
        if(itemInBasket.length > 0){
            window.localStorage.setItem('d2u-mart-basket', JSON.stringify(itemInBasket));
        }else{
            window.localStorage.removeItem('d2u-mart-basket');
        }
    },[itemInBasket])

    function calculateEachItemPrice(price , number){
        let result = Number(price.replace("￥","").replaceAll(",",''))*number;
        return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function handlePaid( basket , price , numbertOfItem ){
        console.log(basket, price , numbertOfItem);
    }

    return (
        <>
            <div className={`fixed bottom-7 left-10 ${isShowPopupBasket ? 'bg-[#c8ceca]' : 'bg-[#f48b66]'} rounded-full p-3 flex justify-center items-center cursor-pointer hover:-translate-y-2 hover:scale-105 ease-in duration-200 z-[999]`} 
                style={{fontFamily: '"Prompt", sans-serif' , boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px'}}
                onClick={()=>{
                    setIsShowPopupBasket(!isShowPopupBasket);
                }}
            >
                {countItemInBasket !== 0 && <div className={`absolute top-0 right-0 w-5 h-5 text-[14px] text-white flex justify-center items-center rounded-full shadow-lg bg-[#09092d]`}>{countItemInBasket}</div>}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
            <AnimatePresence>
                {
                    isShowPopupBasket &&
                    <motion.div className="fixed bottom-[120px] left-7 sm:bottom-7 sm:left-[120px] flex flex-col items-center w-screen max-w-[340px] sm:max-w-[380px] max-h-[550px] h-screen rounded-xl shadow-lg bg-[#fff4ed] z-[999] gap-3 overflow-x-clip" 
                        style={{fontFamily: '"Prompt", sans-serif'}}
                        animate={{scale:1 , x:0 , y:0 , opacity:1}}
                        initial={{scale:0 , x:-205 , y:300 , opacity:0}}
                        exit={{scale:0 , x:-205 , y:300 , opacity:0}}
                        transition={{duration:0.2}}
                    >
                        <div className=" absolute top-0 w-full flex justify-between items-center pl-[24px] pr-[10px] py-[10px] text-[20px]  bg-[#c8ceca] rounded-t-xl">
                            <div className="flex items-center gap-2">
                                <ShoppingBasketIcon/>
                                ตะกร้า
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                onClick={()=>{setIsShowPopupBasket(false)}}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="w-full h-full max-h-[340px] overflow-y-auto mt-[50px] flex flex-col items-center divide-y-[1px] divide-gray-300"
                            onWheel={(e)=>{
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                            
                        >
                            {itemInBasket.map((item ,index)=>(
                                <div key={`itemInBasket${index}`} className="w-full bg-white px-[10px] py-3 flex gap-[10px] items-center relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer absolute top-4 right-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                        onClick={()=>{
                                            setItemInBasket(itemInBasket.filter(keepItemInBasket=>keepItemInBasket.id !== item.id ))
                                        }}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <img src={item.image_url ? item.image_url : item.image } alt="" className="w-[90px] h-[90px] object-cover"/>
                                    <div className="flex w-full justify-between items-center">
                                        <div className="flex flex-col items-start w-full max-w-[150px] gap-2">
                                            <p className='m-0 text-[14px]'>{item.name}</p>
                                            <p className='m-0 text-[14px] font-semibold'>{item.price}</p>
                                            <div className="min-w-[80px] h-[30px] flex justify-between rounded-lg text-gray-500 shadow-md">
                                                <div className="bg-[#d9cfc9] active:bg-[#877d76] flex-1 flex items-center justify-center cursor-pointer rounded-l-md ease-linear duration-300"
                                                    onClick={()=>{
                                                        let newBasket = [];
                                                        itemInBasket.forEach(itemInBasketCountChange=>{
                                                            if(itemInBasketCountChange.id === item.id){
                                                                if(itemInBasketCountChange.count > 1){
                                                                    newBasket.push({
                                                                        ...itemInBasketCountChange,
                                                                        count: itemInBasketCountChange.count - 1,
                                                                    });
                                                                }
                                                            }else{
                                                                newBasket.push(itemInBasketCountChange);
                                                            }
                                                        });
                                                        setItemInBasket(newBasket)
                                                    }}
                                                >
                                                    -
                                                </div>
                                                <div className="bg-[#f0ecea] flex-1 flex items-center justify-center">
                                                    {item.count}
                                                </div>
                                                <div className="bg-[#d9cfc9] active:bg-[#877d76] flex-1 flex items-center justify-center cursor-pointer rounded-r-md ease-linear duration-300"
                                                    onClick={()=>{
                                                        setItemInBasket(itemInBasket.map(itemInBasketCountChange=>{
                                                            if(itemInBasketCountChange.id === item.id){
                                                                return {
                                                                    ...itemInBasketCountChange,
                                                                    count: itemInBasketCountChange.count + 1,
                                                                }
                                                            }else{
                                                                return itemInBasketCountChange;
                                                            }
                                                        }))
                                                    }}
                                                >
                                                    +
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-full flex items-center">
                                            <p className='m-0 text-[15px]'>￥</p>
                                            <p className='m-0 text-[20px]'>{calculateEachItemPrice(item.price , item.count)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex w-full justify-between items-center px-3">
                            <p className='m-0 text-[14px] sm:text-[16px]'>จำนวนสินค้า {countItemInBasket} ชิ้น</p>
                            <div className="flex w-full max-w-[180px] h-[60px] items-center rounded-xl">
                                <div className="flex flex-1 justify-center items-center bg-[#d9cfc9] h-full rounded-l-xl text-[14px]">
                                    รวมทั้งหมด
                                </div>
                                <div className="flex flex-1 h-full justify-center items-center rounded-r-xl bg-[#f0ecea]">
                                    <div className='flex items-center'>
                                        <p className='m-0 text-[14px]'>￥</p>
                                        <p className='m-0 text-[14px]'>{totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p> 
                                    </div>
                                </div>
                            </div>       
                        </div>
                        <div className="w-full flex justify-end px-3">
                            <div className="w-[120px] flex justify-center items-center h-[45px] text-white bg-[#b09b8d] rounded-lg cursor-pointer active:bg-[#4a4a4a] ease-linear duration-500"
                                onClick={()=>{
                                    handlePaid(itemInBasket , totalPrice , countItemInBasket);
                                }}
                            >
                                ชำระเงิน
                            </div>
                        </div>
                        <img src={'/image/sakura_left.png'} alt="" className=" absolute -bottom-5 -left-4 w-[220px]"/>
                    </motion.div>
                }
            </AnimatePresence>
            
        </>
    )
}

export default Basket