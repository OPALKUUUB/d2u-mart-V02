import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import NavBarAdmin from "./components/NavBarAdmin";
import AuctionTable from "./pages/AuctionTable";
import HistoryTable from "./pages/HistoryTable";
import LoginAdmin from "./pages/login/LoginAdmin";
import PaymentTable from "./pages/PaymentTable";
import TrackingTable from "./pages/TrackingTable";
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
              path="/admin/table/tracking"
              component={TrackingTable}
            />
          </Switch>
        </Container>
      </>
    );
  }
}
