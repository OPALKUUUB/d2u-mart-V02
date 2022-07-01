import React from "react";
import Header from "../../component/Header/Header";
import ImageSlider from "../../component/ImageSlider/ImageSlider";

const Home = () => {
  return (
    <div style={{ background: "#fdeee4" }}>
      <Header />
      <ImageSlider />

      <img
        src="/image/section_footer_1.jpg"
        style={{ width: "100%" }}
        alt="process"
      />
    </div>
  );
};

export default Home;
