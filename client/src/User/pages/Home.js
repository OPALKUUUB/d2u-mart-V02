import React, { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("/check/session", {
      headers: { token: localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.status) {
          alert(json.message);
          localStorage.removeItem("token");
          window.location.reload(false);
        }
      });
  }, []);
  return <img src="/home2.jpg" width="100%" />;
}
