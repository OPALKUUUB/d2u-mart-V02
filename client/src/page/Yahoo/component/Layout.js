import React from "react";
import "../Yahoo.css";
import FooterV2 from "../../../component/Footer/FooterV2";
import Menu from "./Menu/Menu";

const Layout = ({ children }) => {
  return (
    <>
      <div className="Yahoo">
        <Menu />
        {children}
      </div>
      <FooterV2 />
    </>
  );
};

export default Layout;
