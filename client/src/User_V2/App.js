import React from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
// Hooks
import useToken from "../hook/useToken";
// Components
import Navbar from "../component/NavbarV2/Navbar";
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
import Abc from "../page/Mart/Shop/Abc/Abc";
import ShowMoreAllItem from "../page/Mart/Shop/ShowMore/ShowMoreAllItem";
import ShowMorePromotion from "../page/Mart/Shop/ShowMorePromotion/ShowMorePromotion";
import { RecoilRoot } from "recoil";
import Payment from "../page/Mart/Payment/Payment";
import Ewelcia from "../page/Mart/Shop/Ewelcia/Ewelcia";
import Omni7 from "../page/Mart/Shop/Omni7/Omni7v2";
import Donki from "../page/Mart/Shop/Donki/Donki";
import Insurance from "../page/Mart/Insurance/Insurance";
import Qa from "../page/Mart/Qa/Qa";
import Review from "../page/Mart/Review/Review";
const AppUserV2 = () => {
  const { token } = useToken();
  let navData = !token ? route : routeAuth;
  return (
    <RecoilRoot>
      <Navbar />
      <Routes>
        {navData.map((nav) => (
          <Route key={nav.id} path={nav.path} element={nav.element} />
        ))}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </RecoilRoot>
  );
};

const NotFound = () => {
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
  {
    id: 16,
    path: "/mart/shop/abc",
    element: <Abc />,
  },
  {
    id: 30,
    path: "/mart/shop/ewelcia",
    element: <Ewelcia />,
  },
  {
    id: 17,
    path: "/mart/shop/showmoreall/:shop",
    element: <ShowMoreAllItem />,
  },
  {
    id: 18,
    path: "/mart/shop/showmorepromotion",
    element: <ShowMorePromotion />,
  },
  {
    id: 19,
    path: "/mart/payment",
    element: <Payment />,
  },
  {
    id: 20,
    path: "/mart/shop/Ewelcia",
    element: <Ewelcia />,
  },
  {
    id: 21,
    path: "/mart/shop/Omni7",
    element: <Omni7 />,
  },
  {
    id: 22,
    path: "/mart/shop/Donki",
    element: <Donki />,
  },
  {
    id: 23,
    path: "/mart/shop/Promotion",
    element: <ShowMorePromotion />,
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
  {
    id: 8,
    path: "/insurance",
    element: <Insurance />,
  },
  {
    id: 9,
    path: "/qa",
    element: <Qa />,
  },
  {
    id: 10,
    path: "/review",
    element: <Review />,
  },
];

export default AppUserV2;
