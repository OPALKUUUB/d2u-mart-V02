import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
// Hooks
import useToken from "../hook/useToken";
// Components
import { Navbar } from "../component/Navbar/Navbar";
// Pages
import Login from "../page/Login/Login";
import Home from "../page/Home/Home";
import ProductService from "../page/ProductService/ProductService";
import { OurService } from "../page/OurService/OurService";
import { ContactUs } from "../page/ContactUs/ContactUs";
// for older pages
import Auction from "../User/pages/Auction";
import YahooAuction from "../User/pages/auction/yahoo/YahooAuction";
import YahooOrder from "../User/pages/auction/yahoo/YahooOrder";
import YahooPayment from "../User/pages/auction/yahoo/YahooPayment";
import YahooAllPayment from "../User/pages/auction/yahoo/YahooAllPayment";
import YahooHistory from "../User/pages/auction/yahoo/YahooHistory";
import Tracking from "../User/pages/Tracking";
import { Register } from "../page/Register/Register";
import MartShop from "../page/Mart/Martshop/MartShop";
import Daiso from "../page/Mart/Shop/Daiso/Daiso";
import Mart from "../page/Mart/Mart";
import Footer from "../component/Footer/Footer";

const AppUserV2 = () => {
  const { token } = useToken();
  let navData = !token ? route : routeAuth;
  return (
    <>
      <Navbar />
      <Routes>
        {navData.map((nav) => (
          <Route key={nav.id} path={nav.path} element={nav.element} />
        ))}
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <h1>File Not Found 404</h1>
      <Link to="/">go home</Link>
    </div>
  );
};

const routeAuth = [
  {
    id: 1,
    path: "/",
    element: <Home />,
  },
  {
    id: 2,
    path: "/home",
    element: <Home />,
  },
  {
    id: 3,
    path: "/auction",
    element: <Auction />,
  },
  {
    id: 4,
    path: "/auction/yahoo",
    element: <YahooAuction />,
  },
  {
    id: 5,
    path: "/auction/yahoo/order",
    element: <YahooOrder />,
  },
  {
    id: 6,
    path: "/auction/yahoo/payment",
    element: <YahooPayment />,
  },
  {
    id: 7,
    path: "/auction/yahoo/payment/all",
    element: <YahooAllPayment />,
  },
  {
    id: 8,
    path: "/auction/yahoo/history",
    element: <YahooHistory />,
  },
  {
    id: 9,
    path: "/tracking",
    element: <Tracking />,
  },
  {
    id: 10,
    path: "/product-service",
    element: <ProductService />,
  },
  {
    id: 11,
    path: "/our-service",
    element: <OurService />,
  },
  {
    id: 12,
    path: "/contact-us",
    element: <ContactUs />,
  },
  {
    id: 13,
    path: "/mart",
    element: <Mart />,
  },
  {
    id: 14,
    path: "/mart/shop",
    element: <MartShop />,
  },
  {
    id: 15,
    path: "/mart/shop/daiso",
    element: <Daiso />,
  },
];
const route = [
  {
    id: 1,
    path: "/",
    element: <Home />,
  },
  {
    id: 2,
    path: "/home",
    element: <Home />,
  },
  {
    id: 3,
    path: "/login",
    element: <Login />,
  },
  {
    id: 4,
    path: "/register",
    element: <Register />,
  },
  {
    id: 5,
    path: "/product-service",
    element: <ProductService />,
  },
  {
    id: 6,
    path: "/our-service",
    element: <OurService />,
  },
  {
    id: 7,
    path: "/contact-us",
    element: <ContactUs />,
  },
];

export default AppUserV2;
