import React from "react";
import Footer from "../../component/Footer/Footer";
import FooterNew from "../../component/Footer/FooterNew";
import Header from "../../component/Header/Header";
import ImageSlider from "../../component/ImageSlider/ImageSlider";
import ServiceProcess from "../../component/ServiceProcess/ServiceProcess";
import "./Home.css";

const Home = () => {
  return (
    <div style={{ background: "#fdeee4" }} className="Home">
      <Header />
      <ImageSlider />

      {/* <ServiceProcess /> */}
      <div className="bg">
        <img src="/image/old/D2U_3.png" width="100%" alt="" />
        <img src="/image/old/D2U_4.png" width="100%" alt="" id="promotion" />
        <img src="/image/old/D2U_5.png" width="100%" alt="" id="point" />
        <img src="/image/sunHome.jpg" width="100%" alt="" />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
