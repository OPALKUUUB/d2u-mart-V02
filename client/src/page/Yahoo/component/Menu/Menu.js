import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  return (
    <div className="YahooMenu">
      <div>
        <Link to="/yahoo/auction">ส่งลิงค์ประมูล</Link>
      </div>
      <div>
        <Link to="/yahoo/order">รายการสั่งซื้อสินค้า</Link>
      </div>
      <div>
        <Link to="/yahoo/payment">รายการที่ต้องชำระ</Link>
      </div>
      <div>
        <Link to="/yahoo/history">ประวัติการสั่งซื้อ</Link>
      </div>
    </div>
  );
};

export default Menu;
