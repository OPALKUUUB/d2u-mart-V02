import "./Header.css";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="Header">
      <h6 className="head-content">
        เริ่มต้นที่
        <br />
        กิโลกรัมละ 140 บาท
      </h6>
      <button type="button" className="learn-more">
        <span onClick={() => navigate("/our-service")}>เรียนรู้เพิ่มเติม </span>
      </button>
      <p className="body-content">
        บริการนําเข้าสินค้าจากประเทศญี่ปุนมายังประเทศไทย
        <br />
        และบริการกดซือสินค้าในเว็บต่าง ๆ
      </p>
      <img className="welcome" src="image/welcome.png" alt="welcome-wipp" />
      <img
        className="sakura-right"
        src="image/sakura_right.png"
        alt="sakura_left-wipp"
      />
      <img className="sun" src="image/sun.png" alt="sun-wipp" />
      <img className="logo" src="image/logo_none.png" alt="logo-wipp" />
      <img
        className="sakura-left"
        src="image/sakura_left.png"
        alt="sakura_left-wipp"
      />
    </div>
  );
};

export default Header;
