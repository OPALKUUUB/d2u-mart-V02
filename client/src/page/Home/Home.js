import React from "react";
import Footer from "../../component/Footer/Footer";
import FooterV2 from "../../component/Footer/FooterV2";
import Header from "../../component/Header/Header";
import ImageSlider from "../../component/ImageSlider/ImageSlider";
import "./Home.css";

const Home = () => {
  return (
    <div style={{ background: "#fdeee4" }} className="Home">
      <Header />
      <ImageSlider />

      {/* <ServiceProcess /> */}
      <div className="bg">
        <img src="/image/service_us.jpg" alt="" />
        {/* <img src="/image/old/D2U_3.png" width="100%" alt="" /> */}
        <img src="/image/old/D2U_4.png" width="100%" alt="" id="promotion" />
        <img src="/image/old/D2U_5.png" width="100%" alt="" id="point" />
        <img src="/image/sunHome.jpg" width="100%" alt="" />
      </div>
      <FooterV2 />
    </div>
  );
};

export default Home;
