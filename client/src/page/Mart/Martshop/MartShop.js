import React from "react";
import BackButt from "../../../component/button/BackButt";
import Basket from "../../../component/Basket/Basket";
import "./MartMenu.css";
import ShopCard from "../../../component/SubCard/ShopCard";
import FooterV2 from "../../../component/Footer/FooterV2";

const MartShop = () => {
  return (
    <section style={{ fontFamily: '"Prompt", sans-serif' }}>
      <BackButt link="/mart" />
      <img
        src="/image/martCover.png"
        className="w-full object-cover object-center"
        alt=""
      ></img>
      <div className="w-full flex bg-gray-100">
        <img
          src="/image/vertical-break.png"
          className="hidden md:flex w-[120px] lg:w-[180px] justify-start"
          alt="vertical-break"
        />
        <div className="w-full">
          <div className="flex justify-center flex-wrap gap-[100px] mt-[50px]">
            {ShopData.map((item) => (
              <ShopCard
                name={item.name}
                link={item.link}
                image_url={item.image_url}
                alt={item.alt}
                mode={item?.mode || ""}
              />
            ))}
          </div>
        </div>
      </div>
      <Basket />
      <FooterV2 />
    </section>
  );
};

const ShopData = [
  {
    id: 1,
    name: "7-Eleven",
    link: "/mart/shop/Omni7",
    image_url: "https://img.omni7.jp/cm/9999/logo/site/PC/header_omni_2x.png",
    alt: "https://www.omni7.jp/",
  },
  {
    id: 2,
    name: "Gashapon",
    link: "/mart/shop/Ewelcia",
    image_url: "/image/gachapong.jpg",
    alt: "https://www.welcia-yakkyoku.co.jp/",
    //mode: "dev",
  },
  {
    id: 3,
    name: "Donki",
    link: "/mart/shop/Donki",
    image_url: "/image/donki.png",
    alt: "https://www.donki.com/",
  },
  {
    id: 4,
    name: "Tokyo DisneySea",
    link: "/mart/shop/disney",
    image_url: "/image/disney.jpg",
    alt: "",
    mode: "dev",
  },
];

export default MartShop;
