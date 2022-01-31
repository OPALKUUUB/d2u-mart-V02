import React from "react";
import { useHistory } from "react-router-dom";
import AppAdmin from "./Admin/AppAdmin";
import AppUser from "./User/AppUser";
function App() {
  const history = useHistory();
  if (history.location.pathname.split("/")[1] === "admin") {
    return <AppAdmin />;
  } else {
    return <AppUser />;
  }
}

export default App;
