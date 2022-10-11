import React from "react";
import "./OurService.css";
import {
  OurService as OurService1,
  YardImport,
} from "../../component/OurService/OurService";

export const OurService = () => {
  return (
    <>
      <div className="OurService">
        <div className="content">
          <OurService1 />
          <YardImport />
          {/* <img src="/image/service_us.jpg" alt="" /> */}
          {/* <img src="/image/service_us_2.jpg" alt="" />
          <img src="/image/service_us_3.jpg" alt="" />
          <img src="/image/service_us_4.jpg" alt="" />
          <img src="/image/service_us_5.jpg" alt="" /> */}
        </div>
      </div>
    </>
  );
};
