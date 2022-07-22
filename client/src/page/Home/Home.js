import React from "react";
import Footer from "../../component/Footer/Footer";
import FooterNew from "../../component/Footer/FooterNew";
import Header from "../../component/Header/Header";
import ImageSlider from "../../component/ImageSlider/ImageSlider";
import ServiceProcess from "../../component/ServiceProcess/ServiceProcess";

const Home = () => {
  return (
    <div style={{ background: "#fdeee4" }}>
      <Header />
      <ImageSlider />

      {/* <ServiceProcess /> */}
      <img src="/image/old/D2U_3.png" width="100%" />
      <img src="/image/old/D2U_4.png" width="100%" />
      <img src="/image/old/D2U_5.png" width="100%" />
      <img src="/image/old/D2U_6.png" width="100%" />

      <Footer />
    </div>
  );
};

export default Home;
