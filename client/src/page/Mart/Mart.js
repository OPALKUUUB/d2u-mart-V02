import React from "react";
import { useNavigate } from "react-router-dom";
import "./Mart.css";

const Mart = () => {
  const navigate = useNavigate()
  return (
      <div className="center">
        <div className="card-container">
            <h2 className="cardShop">ร้านค้า</h2>
            <span className="dot"></span>
            <span className="learnmore">เรียนรู้เพิ่มเติม</span>
            <p className="verti-text">SHOP</p>
            <img className="bgimg" src="/image/productCard.png" alt="" onClick={()=>navigate("/mart/shop")}></img>
        </div>
        <div className="card-container">
            <h2 className="cardShop2">โปรโมชั่น</h2>
            <span className="dot2"></span>
            <span className="learnmore2">เรียนรู้เพิ่มเติม</span>
            <p className="verti-text2">PROMO</p>
            <img className="bgimg" src="/image/promotionCard.png" alt="" onClick={()=>navigate("/mart/shop/showmorepromotion")}></img>
        </div>
      </div>
  );
};

export default Mart;
