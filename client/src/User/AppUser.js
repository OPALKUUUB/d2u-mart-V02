import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import NavBarUser from "./components/NavBarUser";
import Login from "./pages/login-regis/Login";
import Home from "./pages/Home";
import Auction from "./pages/Auction";
import Tracking from "./pages/Tracking";
import YahooAuction from "./pages/auction/yahoo/YahooAuction";
import YahooOrder from "./pages/auction/yahoo/YahooOrder";
import YahooPayment from "./pages/auction/yahoo/YahooPayment";
import YahooAllPayment from "./pages/auction/yahoo/YahooAllPayment";
import YahooHistory from "./pages/auction/yahoo/YahooHistory";
import Profile from "./pages/Profile";

export default function AppUser() {
  const [loginStatus, setLoginStatus] = useState(
    localStorage.getItem("token") !== null
  );

  if (!loginStatus) {
    return <Login />;
  } else {
    return (
      <>
        <NavBarUser />
        <Container>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auction" component={Auction} />
            <Route exact path="/auction/yahoo" component={YahooAuction} />
            <Route exact path="/auction/yahoo/order" component={YahooOrder} />
            <Route exact path="/setting/profile" component={Profile} />
            <Route
              exact
              path="/auction/yahoo/payment"
              component={YahooPayment}
            />
            <Route
              exact
              path="/auction/yahoo/payment/all"
              component={YahooAllPayment}
            />
            <Route
              exact
              path="/auction/yahoo/history"
              component={YahooHistory}
            />
            <Route exact path="/tracking" component={Tracking} />
          </Switch>
        </Container>
      </>
    );
  }
}
