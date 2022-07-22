import React from "react";
import BackButt from "../../../component/button/BackButt";
import Footer from "../../../component/Footer/Footer";
import SubCard from "../../../component/SubCard/SubCard";
import Basket from "../../../component/Basket/Basket";
import "./MartMenu.css";

const MartShop = () => {
  return (
    <section style={{ fontFamily: '"Prompt", sans-serif' }}>
      <BackButt link="/mart" />
      <img
        src="/image/martCover.png"
        className="w-full object-cover object-center"
        alt=""
      ></img>
      <div className=" w-full flex justify-start items-center bg-[#e6e5e1]">
        <img src="/image/vertical-break.png" className="hidden md:flex w-[120px] lg:w-[180px]" alt="" />
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-[900px] justify-items-center gap-y-4 py-4 md:py-0" >
              <SubCard text="DAISO" link="/mart/shop/showmoreall/daiso" />
              <SubCard text="ABC-MART" link="/mart/shop/abc" />
              <SubCard text="E-WELCIA" link="/mart/shop/Ewelcia" />
              <SubCard text="7-ELEVEN" link="/mart/shop/abc" />
            </div>
        </div>
        {/* <SubCard text = "DAISO" link = "/mart/MartDaiso"/>
            <SubCard text = "DAISO" link = "/mart/MartDaiso"/> */}
      </div>
      <Basket/>
    </section>
  );
};

export default MartShop;
