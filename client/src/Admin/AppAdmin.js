import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import NavBarAdmin from "./components/NavBarAdmin";
import AuctionAdmin from "./pages/AuctionAdmin";
import AuctionTable from "./pages/AuctionTable";
import HistoryTable from "./pages/HistoryTable";
import LoginAdmin from "./pages/login/LoginAdmin";
import PaymentTable from "./pages/PaymentTable";
import FrilTracking from "./pages/tracking/Fril";
import MercariTracking from "./pages/tracking/MercariTracking";
import OtherTracking from "./pages/tracking/OtherTracking";
import ShimizuTracking from "./pages/tracking/ShimizuTracking";
import UserTable from "./pages/UserTable";
export default function AppAdmin() {
  const [loginStatus, setLoginStatus] = useState(
    localStorage.getItem("AdminToken") !== null
  );
  if (!loginStatus) {
    return <LoginAdmin />;
  } else {
    return (
      <>
        <NavBarAdmin />
        <Container>
          <Switch>
            <Route exact path="/admin" component={AuctionTable} />
            <Route
              exact
              path="/admin/table/yahoo/auction"
              component={AuctionTable}
            />
            <Route exact path="/admin/yahoo/auction" component={AuctionAdmin} />
            <Route
              exact
              path="/admin/table/yahoo/payment"
              component={PaymentTable}
            />
            <Route
              exact
              path="/admin/table/yahoo/history"
              component={HistoryTable}
            />
            <Route
              exact
              path="/admin/table/tracking/shimizu"
              component={ShimizuTracking}
            />
            <Route
              exact
              path="/admin/table/tracking/mercari"
              component={MercariTracking}
            />
            <Route
              exact
              path="/admin/table/tracking/123"
              component={OtherTracking}
            />
            <Route
              exact
              path="/admin/table/tracking/fril"
              component={FrilTracking}
            />
            <Route exact path="/admin/table/user" component={UserTable} />
          </Switch>
        </Container>
      </>
    );
  }
}
