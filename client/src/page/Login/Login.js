import React, { useState } from "react";
import useToken from "../../hook/useToken";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import BackButt from "../../component/button/BackButt";

async function loginUser(credentials) {
  return await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
  // .finally(() => console.log("fetch done!"));
}

const Login = () => {
  const navigate = useNavigate();
  const { setToken } = useToken();
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    setLogin((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const [isHoverButton, setIsHoverButton] = useState(false);
  const handleSignIn = async (e) => {
    e.preventDefault();
    const token = await loginUser(login);
    await setToken(token);
    navigate("/");
    window.location.reload(false);
  };
  return (
    <div
      className="w-full min-h-screen flex absolute top-0 justify-center items-center bg-[#fef1e7] overflow-clip py-4"
      style={{ fontFamily: '"Prompt", sans-serif' }}
    >
      <img
        className="absolute left-0 h-full object-cover w-[200px] hidden lg:flex"
        src="/image/side.png"
        alt=""
      />
      <img
        src="/image/sakura-rotate.png"
        alt=""
        className="top-32 -right-5 absolute w-[500px] object-cover object-center hidden lg:flex"
      />
      <img
        src="/image/sakura-bott.png"
        alt=""
        className="absolute -bottom-7 right-20 hidden lg:flex w-[250px]"
      />
      <img
        src="/image/ciecle.png"
        alt=""
        className="absolute bottom-16 right-8 hidden lg:flex w-[50px]"
      />
      <form
        onSubmit={handleSignIn}
        className="flex flex-col w-full max-w-[600px] h-full justify-center items-center gap-[50px] mt-[80px] px-4"
      >
        <motion.h1
          className="font-semibold tracking-[0.1em] text-[36px] md:text-[50px]"
          animate={{ y: 0, opacity: 1, scale: 1 }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          end={{ y: -200 }}
          transition={{ duration: 0.5 }}
        >
          SIGN IN
        </motion.h1>
        <motion.div
          className="flex flex-col w-full items-start gap-[10px]"
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: -500, opacity: 0 }}
          end={{ y: -500 }}
          transition={{ duration: 0.8 }}
        >
          <label className="tracking-[0.05em] text-[16px] md:text-[18px]">
            USERNAME
          </label>
          <input
            className="w-full py-2 px-[18px] rounded-lg bg-[#dcd1ca] text-[18px] md:text-[22px] text-[#bd9095] placeholder:text-[#bd9095] outline-none"
            type="text"
            name="username"
            value={login.username}
            onChange={handleChange}
          />
        </motion.div>
        <motion.div
          className="flex flex-col w-full items-start gap-[10px]"
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: -500, opacity: 0 }}
          end={{ y: -500 }}
          transition={{ duration: 1.1 }}
        >
          <label className="tracking-[0.05em] text-[16px] md:text-[18px]">
            PASSWORD
          </label>
          <input
            className="w-full py-2 px-[18px] rounded-lg bg-[#dcd1ca] text-[18px] md:text-[22px] text-[#bd9095] placeholder:text-[#bd9095] outline-none"
            type="password"
            name="password"
            value={login.password}
            onChange={handleChange}
          />
        </motion.div>
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: -200, opacity: 0 }}
          end={{ y: -200 }}
          transition={{ duration: 1.4 }}
        >
          <div>
            <button
              type="submit"
              className="tracking-[0.15em] font-semibold text-[18px] md:text-[22px] bg-[#f47e67] rounded-full py-[15px] w-[180px] md:w-[240px] ease-linear duration-150 flex justify-center"
              onMouseEnter={() => setIsHoverButton(true)}
              onMouseLeave={() => setIsHoverButton(false)}
            >
              SIGN IN{" "}
              <span
                className={`${
                  isHoverButton
                    ? " w-5 opacity-100 pl-5"
                    : " w-0 opacity-0 pl-0"
                } duration-200 ease-linear inline-block`}
              >
                &raquo;
              </span>
            </button>
            <div style={{ textAlign: "center" }}>
              <Link to={"/register"}>Register</Link>
            </div>
          </div>
        </motion.div>
      </form>
      <div
        style={{
          position: "absolute",
          top: "50px",
          left: "10px",
        }}
      >
        <BackButt link="/home" />
      </div>
    </div>
  );
};

export default Login;
