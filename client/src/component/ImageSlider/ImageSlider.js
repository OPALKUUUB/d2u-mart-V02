import React, { useState } from "react";
import { SliderData } from "./SliderData";
import "./ImageSlider.css";

const ImageSlider = (slides) => {
  const [current, setCurrent] = useState(0);
  const length = 1;

  const nextSlide = () => {
    setCurrent(current === length ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length : current - 1);
  };

  return (
    <section className="slider py-[50px] lg:py-[100px]">
      <img
        src="/image/left.png"
        className="left-arrow -translate-y-1/2 top-1/2 w-[40px] h-[80px] sm:w-[50px] sm:h-[100px] md:w-[80px] md:h-[160px] lg:w-[100px] lg:h-[200px]"
        onClick={prevSlide}
        alt="left.png"
      />
      <img
        src="/image/right.png"
        className="right-arrow -translate-y-1/2 top-1/2 w-[40px] h-[80px] sm:w-[50px] sm:h-[100px] md:w-[80px] md:h-[160px] lg:w-[100px] lg:h-[200px]"
        onClick={nextSlide}
        alt="right.png"
      />
      {SliderData.map((slides, index) => {
        return (
          <div
            className={index === current ? "slide active" : "slide"}
            key={`imageSlider${index}`}
          >
             <img src={slides.image} alt="" className={`Image object-cover w-full h-full max-h-[700px] max-w-[1200px] rounded-[0px] lg:rounded-[10px] ${index === current ? 'flex' :'hidden'} `}/>
          </div>
        
        );
      })}
    </section>
  );
};

export default ImageSlider;
