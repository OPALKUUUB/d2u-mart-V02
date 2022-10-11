import React, { useState } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useToken from "../../hook/useToken";
import Hamburger from "hamburger-react";

import { AiFillHome } from "react-icons/ai";
import { RiAuctionFill, RiQuestionAnswerFill } from "react-icons/ri";
import { FiPackage, FiLogOut } from "react-icons/fi";
import { FaShoppingCart, FaHandHoldingHeart, FaHeadset } from "react-icons/fa";
import { MdPayment, MdRateReview } from "react-icons/md";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { CgLogIn } from "react-icons/cg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useToken();
  const [isOpen, setOpen] = useState(false);

  if (token) {
    return (
      <div className="Navbar">
        <img
          className="Navbar-logo"
          src="/logo_none.png"
          alt=""
          onClick={() => navigate("/")}
        />
        <div className="Navbar-link">
          {LinkAuth.map((item) => {
            let home = false;
            if (item.path === "home" && location.pathname === "/") {
              home = true;
            }
            return (
              <div key={["Navbar-link", item.id].join("_")}>
                <Link
                  className={
                    location.pathname === "/" + item.path || home
                      ? "link active"
                      : "link"
                  }
                  to={item.path}
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
        </div>
        <div
          className="Navbar-end"
          onClick={() => {
            navigate("/");
            logout();
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "white",
            }}
          >
            <FiLogOut />
            <span>Logout</span>
          </div>
        </div>
        <div className="responsive">
          <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
          <div className={`Navbar-menu ${isOpen && "active"}`}>
            {LinkAuth.map((item) => (
              <div className="Navbar-item" onClick={() => navigate(item.path)}>
                {item?.icon}
                <span style={{ marginTop: "3px" }}>{item.name}</span>
              </div>
            ))}
            <div
              className="Navbar-item"
              onClick={() => {
                navigate("/");
                logout();
              }}
            >
              <FiLogOut />
              Logout
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="Navbar">
      <img
        className="Navbar-logo"
        src="/logo_none.png"
        alt=""
        onClick={() => navigate("/")}
      />
      <div className="Navbar-link">
        {LinkNoAuth.map((item) => {
          let home = false;
          if (item.path === "home" && location.pathname === "/") {
            home = true;
          }
          return (
            <div key={["Navbar-link", item.id].join("_")}>
              <Link
                to={item.path}
                className={
                  location.pathname === "/" + item.path || home
                    ? "link active"
                    : "link"
                }
              >
                {item.name}
              </Link>
            </div>
          );
        })}
      </div>
      <div className="Navbar-end">
        <Link to="login">เข้าสู่ระบบ</Link>
        <span>|</span>
        <Link to="register">ลงทะเบียน</Link>
      </div>
      <div className="responsive">
        <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
        <div className={`Navbar-menu ${isOpen && "active"}`}>
          {LinkNoAuth.map((item) => (
            <div className="Navbar-item" onClick={() => navigate(item.path)}>
              {item?.icon}
              <span style={{ marginTop: "3px" }}>{item.name}</span>
            </div>
          ))}
          <div
            className="Navbar-item"
            onClick={() => {
              setOpen(false);
              navigate("login");
            }}
          >
            <CgLogIn />
            เข้าสู่ระบบ
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkAuth = [
  { id: 1, path: "/home", name: "หน้าหลัก", icon: <AiFillHome /> },
  {
    id: 2,
    path: "/yahoo/auction",
    name: "ประมูล Yahoo",
    icon: <RiAuctionFill />,
  },
  { id: 3, path: "/tracking", name: "เช็กสถานะสินค้า", icon: <FiPackage /> },
  { id: 4, path: "/mart", name: "ซื้อของหน้าร้าน", icon: <FaShoppingCart /> },
  { id: 5, path: "/pay-service", name: "ชำระค่าบริการ", icon: <MdPayment /> },
];
const LinkNoAuth = [
  { id: 1, path: "/home", name: "หน้าหลัก", icon: <AiFillHome /> },
  {
    id: 2,
    path: "/our-service",
    name: "บริการของเรา",
    icon: <FaHandHoldingHeart />,
  },
  {
    id: 3,
    path: "/insurance",
    name: "การรับประกัน",
    icon: <HiOutlineShieldCheck />,
  },
  {
    id: 4,
    path: "/qa",
    name: "คำถามที่พบบ่อย",
    icon: <RiQuestionAnswerFill />,
  },
  { id: 5, path: "/contact-us", name: "ติดต่อเรา", icon: <FaHeadset /> },
  { id: 6, path: "/review", name: "รีวิว", icon: <MdRateReview /> },
];
export default Navbar;
