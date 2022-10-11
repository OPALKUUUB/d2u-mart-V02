import React from "react";
import { useNavigate } from "react-router-dom";
import "./Mart.css";
// import FooterV2 from "../../component/Footer/FooterV2";

const Mart = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="Mart-container">
        <div className="Mart">
          <div className="content">
            <div
              className="card-container"
              onClick={() => navigate("/mart/shop")}
            >
              <h2 className="cardShop">ร้านค้า</h2>
              <span className="dot"></span>
              <span className="learnmore">เรียนรู้เพิ่มเติม</span>
              <p className="verti-text">SHOP</p>
              <img className="bgimg" src="/image/productCard.png" alt=""></img>
            </div>
            <div
              className="card-container"
              onClick={() => navigate("/mart/shop/showmorepromotion")}
            >
              <h2 className="cardShop2">โปรโมชั่น</h2>
              <span className="dot2"></span>
              <span className="learnmore2">เรียนรู้เพิ่มเติม</span>
              <p className="verti-text2">PROMO</p>
              <img
                className="bgimg"
                src="/image/promotionCard.png"
                alt=""
                onClick={() => navigate("/mart/shop/showmorepromotion")}
              ></img>
            </div>
          </div>
        </div>
      </div>
      {/* <FooterV2 /> */}
    </>
  );
};

export default Mart;
