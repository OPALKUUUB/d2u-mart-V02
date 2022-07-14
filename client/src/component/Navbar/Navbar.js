import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useToken from "../../hook/useToken";
import Hamburger from "hamburger-react";
import "./Navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();
  const { token, logout } = useToken();
  const location = useLocation();
  const [showLink, setShowLinks] = useState(false);
  if (token) {
    return (
      <nav className="Navbar">
        <div className="Navbar-left">
          <img src="/logo_none.png" alt="logo_image" />
        </div>
        <div className="Navbar-mid" id={showLink ? "hidden" : ""}>
          <ul>
            <li>
              <Link
                to="/home"
                className={
                  location.pathname === "/home" || location.pathname === "/"
                    ? "link active"
                    : "link"
                }
              >
                หน้าหลัก
              </Link>
            </li>
            <li>
              <Link
                to="/auction"
                className={
                  location.pathname === "/auction" ? "link active" : "link"
                }
              >
                ประมูล Yahoo
              </Link>
            </li>
            <li>
              <Link
                to="/tracking"
                className={
                  location.pathname === "/tracking" ? "link active" : "link"
                }
              >
                Tracking
              </Link>
            </li>
            <li>
              <Link
                to="/mart"
                className={
                  location.pathname === "/mart" ? "link active" : "link"
                }
              >
                ร้านค้า
              </Link>
            </li>
            <li>
              <Link
                to="/product-service"
                className={
                  location.pathname === "/product-service"
                    ? "link active"
                    : "link"
                }
              >
                บริการนำเข้าสินค้า
              </Link>
            </li>
            <li>
              <Link
                to="/our-service"
                className={
                  location.pathname === "/our-service" ? "link active" : "link"
                }
              >
                บริการของเรา
              </Link>
            </li>
            <li>
              <Link
                to="/contact-us"
                className={
                  location.pathname === "/contact-us" ? "link active" : "link"
                }
              >
                ติดต่อเรา
              </Link>
            </li>
            <li>
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate("/");
                  logout();
                }}
              >
                Logout
              </span>
            </li>
          </ul>
        </div>
        <div className="Navbar-right">
          <button onClick={() => setShowLinks(!showLink)}>
            <Hamburger />
          </button>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
              logout();
            }}
          >
            Logout
          </span>
        </div>
      </nav>
    );
  }
  return (
    <nav className="Navbar">
      <div className="Navbar-left">
        <img src="/logo_none.png" alt="logo_image" />
      </div>
      <div className="Navbar-mid">
        <ul>
          <li>
            <Link
              to="/home"
              className={
                location.pathname === "/home" || location.pathname === "/"
                  ? "link active"
                  : "link"
              }
            >
              หน้าหลัก
            </Link>
          </li>
          <li>
            <Link
              to="/product-service"
              className={
                location.pathname === "/product-service"
                  ? "link active"
                  : "link"
              }
            >
              บริการนำเข้าสินค้า
            </Link>
          </li>
          <li>
            <Link
              to="/our-service"
              className={
                location.pathname === "/our-service" ? "link active" : "link"
              }
            >
              บริการของเรา
            </Link>
          </li>
          <li>
            <Link
              to="/contact-us"
              className={
                location.pathname === "/contact-us" ? "link active" : "link"
              }
            >
              ติดต่อเรา
            </Link>
          </li>
        </ul>
      </div>
      <div className="Navbar-right no-auth">
        <span>
          <Link
            to="/login"
            className={location.pathname === "/login" ? "link active" : "link"}
          >
            เข้าสู่ระบบ
          </Link>{" "}
          |{" "}
          <Link
            to="/register"
            className={
              location.pathname === "/register" ? "link active" : "link"
            }
          >
            ลงทะเบียน
          </Link>
        </span>
      </div>
    </nav>
  );
};
