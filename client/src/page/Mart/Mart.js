import React from "react";
import Card from "../../component/Card/Card";

const Mart = () => {
  return (
    <section style={{ marginTop: "50px" }}>
      <Card text="ร้านค้า" link="/mart/shop" />
      <Card text="โปรโมชั่น" link="/mart/shop/showmorepromotion" />
      <Card text="หมวดหมู่" />
    </section>
  );
};

export default Mart;
