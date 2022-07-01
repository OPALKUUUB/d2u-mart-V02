import BackButt from "../../../../component/button/BackButt";
import SubCard from "../../../../component/SubCard/SubCard";
import "../../Martshop/MartMenu.css"
import { useEffect } from "react";
import { getAllShop } from "../api";

const Daiso = () => {
    useEffect(()=>{
        (async function(){
            await getAllShop();
        }())
    },[])
    return (
        <section style={{backgroundColor:'#e6e5e1'}}>
            <BackButt link = "/mart/shop"/>
            <img src="/image/daisoCover.png" className="cover" alt=""></img>
            <div>
                <a className="Readmore-right">แสดงเพิ่มเติม &raquo;</a>
                <img src="/image/side.png" className="side" alt=""></img>
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
            <div className="product">
                <a className="Readmore-left">แสดงเพิ่มเติม &raquo;</a>
                <img src="/image/product.png" className="productHeader" alt=""></img>
                <img src="/image/side.png" className="sideProduct" alt=""></img>
                <div className="content-left">
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                    <SubCard text = "DAISO"/>
                </div>
            </div>
        </section>
      );
  };
  
export default Daiso;