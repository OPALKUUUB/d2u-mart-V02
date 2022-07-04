import BackButt from "../../../../component/button/BackButt";
import SubCard from "../../../../component/SubCard/SubCard";
import "../../Martshop/MartMenu.css"
import { useEffect, useState } from "react";
import { getAllCategory, getItemInCategory } from "../api";
import MartCategory from "../../../../component/MartCategory/MartCategory";
import { useNavigate } from "react-router-dom";
import Basket from "../../Martshop/Basket";
import { useRecoilState } from "recoil";
import { basketState } from "../../../../AppStateManagement/ShopAtom";

const Daiso = () => {
    const [ allCategory , setAllCategory ] = useState([])
    const [ categorySelected , setCategorySelected ] = useState(0);
    const [ allItemData , setAllItemData ] = useState([]);
    const [ itemInBasket , setItemInBasket ] = useRecoilState(basketState);
    const navigate = useNavigate();
    useEffect(()=>{
        window.scrollTo(0, 0);
        (async function(){
            let resultCategory = await getAllCategory('daisonet.com');
            let categoryList = [];
            resultCategory.forEach((category)=>{
                categoryList.push(category.data())
            })
            setAllCategory(categoryList);
        }())
    },[])

    useEffect(()=>{
        if(allCategory.length > 0){
            (async function(){
                let resultItems = await getItemInCategory('daisonet.com',allCategory[categorySelected]?.name);
                setAllItemData(resultItems)
            }())
        }
    },[allCategory , categorySelected])

    return (
        <section style={{backgroundColor:'#e6e5e1'}}>
            <BackButt link = "/mart/shop"/>
            <img src="/image/daisoCover.png" className="cover" alt=""></img>
            <MartCategory key={'DaisoCategory'} allCategory={allCategory} categorySelected={categorySelected} setCategorySelected={setCategorySelected}/>
            {/* <div className="relative pb-[100px]">
                <a className="Readmore-right"
                    onClick={()=>navigate('/mart/shop/showmorepromotion/daiso')}
                >แสดงเพิ่มเติม &raquo;</a>
                <img src="/image/side.png" className="absolute w-[230px] h-full" alt=""></img>
                <img src="/image/promotionText.png" className="promotion" alt=""></img>
                <div className="content-right">
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                </div>
            </div> */}
            <img src="/image/break.png" className="break" alt=""></img>
            <div className=" relative w-full flex flex-col items-center py-5 pr-0 lg:pr-[280px] xl:pr-[400px]">
                
                <img src="/image/side.png" className="absolute hidden xl:flex right-0 w-[160px] h-full object-cover top-0" alt=""/>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 w-full max-w-fit 2xl:max-w-[1100px] justify-items-ce gap-y-6 gap-x-4 relative py-[40px]">
                    <p className="absolute mb-0 top-0 left-7 hover:text-[#718275] ease-linear duration-500 underline cursor-pointer" 
                        onClick={() => navigate('/mart/shop/showmoreall/daiso')}
                    >แสดงเพิ่มเติม &raquo;</p>
                    <img src="/image/product.png" className="absolute hidden lg:flex top-[55px] -right-[300px] 2xl:-right-[280px] " alt=""/>
                    {allItemData.map((item,index)=>{
                        if(index < 6){
                            return <SubCard key={`subcard${index}`} text = {item?.name} image_url = {item?.image_url} price={item?.price} item={item} />
                        }
                    })}
                    
                    {/* <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/> */}
                </div>
            </div>
            <Basket/>
        </section>
      );
  };
  
export default Daiso;