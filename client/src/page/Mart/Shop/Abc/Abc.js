import BackButt from "../../../../component/button/BackButt";
import SubCard from "../../../../component/SubCard/SubCard";
import "../../Martshop/MartMenu.css"
import { useEffect, useState } from "react";
import { getAllCategory, getItemInCategory } from "../api";
import MartCategory from "../../../../component/MartCategory/MartCategory";
import { useNavigate } from "react-router-dom";

const Abc = () => {
    const [ allCategory , setAllCategory ] = useState([])
    const [ categorySelected , setCategorySelected ] = useState(0);
    const [ allItemData , setAllItemData ] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        window.scrollTo(0, 0);
        (async function(){
            let resultCategory = await getAllCategory('www.abc-mart.net');
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
                let resultItems = await getItemInCategory('www.abc-mart.net',allCategory[categorySelected]?.name);
                setAllItemData(resultItems)
            }())
        }
    },[allCategory , categorySelected])

    console.log(allItemData);

    return (
        <section style={{backgroundColor:'#e6e5e1'}}>
            <BackButt link = "/mart/shop"/>
            <img src="/image/daisoCover.png" className="cover" alt=""></img>
            <MartCategory key={'AbcCategory'} allCategory={allCategory} categorySelected={categorySelected} setCategorySelected={setCategorySelected}/>
            <div className="relative pb-[100px]">
                <a className="Readmore-right"
                    onClick={()=>navigate('/mart/shop/showmorepromotion/abc')}
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
            </div>
            <img src="/image/break.png" className="break" alt=""></img>
            <div className="product relative">
                <a className="Readmore-left"
                    onClick={() => navigate('/mart/shop/showmoreall/abc')}
                >แสดงเพิ่มเติม &raquo;</a>
                <img src="/image/product.png" className="productHeader" alt=""></img>
                <img src="/image/side.png" className="absolute right-0 w-[230px] h-full object-cover top-0" alt=""></img>
                <div className="content-left">
                    {allItemData.map((item,index)=>{
                        if(index < 6){
                            return <SubCard key={`subcard${index}`} text = {item?.name} image_url = {item?.image} price={item?.price} />
                        }
                    })}
                    
                    {/* <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/> */}
                </div>
            </div>
        </section>
      );
  };
  
export default Abc;