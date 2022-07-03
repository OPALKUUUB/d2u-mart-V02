import React from "react";
import Header from "../../component/Header/Header";
import ImageSlider from "../../component/ImageSlider/ImageSlider";
import ServiceProcess from "../../component/ServiceProcess/ServiceProcess";

const Home = () => {
  return (
    <div style={{ background: "#fdeee4" }}>
      <Header />
      {/* <ImageSlider /> */}

      <ServiceProcess />
    </div>
  );
};

export default Home;
