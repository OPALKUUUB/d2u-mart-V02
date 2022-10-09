import React, { useState } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useToken from "../../hook/useToken";
import Hamburger from "hamburger-react";

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
          Logout
        </div>
        <div className="responsive">
          <Hamburger toggled={isOpen} toggle={setOpen} color="white" />
          {isOpen && (
            <div className="Navbar-menu">
              {LinkAuth.map((item) => (
                <div
                  className="Navbar-item"
                  onClick={() => navigate(item.path)}
                >
                  {item.name}
                </div>
              ))}
              <div
                className="Navbar-item"
                onClick={() => {
                  navigate("/");
                  logout();
                }}
              >
                Logout
              </div>
            </div>
          )}
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
        {isOpen && (
          <div className="Navbar-menu">
            {LinkNoAuth.map((item) => (
              <div className="Navbar-item" onClick={() => navigate(item.path)}>
                {item.name}
              </div>
            ))}
            <div
              className="Navbar-item"
              onClick={() => {
                setOpen(false);
                navigate("login");
              }}
            >
              เข้าสู่ระบบ
            </div>
            <div
              className="Navbar-item"
              onClick={() => {
                navigate("register");
              }}
            >
              ลงทะเบียน
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LinkAuth = [
  { id: 1, path: "home", name: "หน้าหลัก" },
  { id: 2, path: "auction", name: "ประมูล Yahoo" },
  { id: 3, path: "tracking", name: "เช็กสถานะสินค้า" },
  { id: 4, path: "mart", name: "ซื้อของหน้าร้าน" },
  { id: 5, path: "pay-service", name: "ชำระค่าบริการ" },
];
const LinkNoAuth = [
  { id: 1, path: "home", name: "หน้าหลัก" },
  { id: 2, path: "our-service", name: "บริการของเรา" },
  { id: 3, path: "insurance", name: "การรับประกัน" },
  { id: 4, path: "qa", name: "คำถามที่พบบ่อย" },
  { id: 5, path: "contact-us", name: "ติดต่อเรา" },
  { id: 6, path: "review", name: "รีวิว" },
];
export default Navbar;
