import React from "react";
import BackButt from "../../../component/button/BackButt";
import Footer from "../../../component/Footer/Footer";
import SubCard from "../../../component/SubCard/SubCard";
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
      <div className=" w-full flex justify-start items-center bg-[#e6e5e1] h-[700px]">
        <img src="/image/vertical-break.png" className="h-full" alt="" />
        <div className="flex flex-wrap w-full justify-center gap-x-28">
          <SubCard text="DAISO" link="/mart/shop/daiso" />
          <SubCard text="ABC-MART" link="/mart/MartDaiso" />
        </div>
        {/* <SubCard text = "DAISO" link = "/mart/MartDaiso"/>
            <SubCard text = "DAISO" link = "/mart/MartDaiso"/> */}
      </div>
    </section>
  );
};

export default MartShop;
