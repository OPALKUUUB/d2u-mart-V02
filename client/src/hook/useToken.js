import { useState } from "react";

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString !== null) {
      let userToken;
      try {
        userToken = JSON.parse(tokenString);
        return userToken?.token;
      } catch (error) {
        localStorage.removeItem("token");
        alert("Token Expire!");
        window.location.reload(false);
      }
    } else if (tokenString === "undefined") {
      localStorage.removeItem("token");
      window.location.reload(false);
    }
    return false;
  };
  const [token, setToken] = useState(getToken());
  const saveToken = (userToken) => {
    localStorage.setItem("token", JSON.stringify(userToken));
    setToken(userToken.token);
  };
  const removeToken = () => {
    localStorage.removeItem("token");
    window.location.reload(false);
  };
  return {
    setToken: saveToken,
    token,
    logout: removeToken,
  };
}
