import React, { useState } from "react";
import useToken from "../../hook/useToken";
import { motion } from "framer-motion";

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
    window.location.reload(false);
  };
  return (
    <div
      className="w-full min-h-screen flex absolute top-0 justify-center items-center bg-[#fef1e7] overflow-clip pb-3 pt-5"
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
        className="flex flex-col w-full max-w-[600px] h-full justify-center items-center gap-[82px] mt-32"
      >
        <motion.h1
          className="font-semibold tracking-[0.1em] text-[70px] leading-3 mb-6"
          animate={{ y: 0, opacity: 1, scale: 1 }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          end={{ y: -200 }}
          transition={{ duration: 0.5 }}
        >
          SIGN IN
        </motion.h1>
        <motion.div
          className="flex flex-col w-full items-start gap-[27px]"
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: -500, opacity: 0 }}
          end={{ y: -500 }}
          transition={{ duration: 0.8 }}
        >
          <label className="tracking-[0.15em] text-[22px]">USERNAME</label>
          <input
            className="w-full py-3 px-3 rounded-lg bg-[#dcd1ca] text-[24px] text-[#bd9095] outline-none font-[600]"
            type="text"
            name="username"
            value={login.username}
            onChange={handleChange}
          />
        </motion.div>
        <motion.div
          className="flex flex-col w-full items-start gap-[27px]"
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: -500, opacity: 0 }}
          end={{ y: -500 }}
          transition={{ duration: 1.1 }}
        >
          <label className="tracking-[0.15em] text-[22px]">PASSWORD</label>
          <input
            className="w-full py-3 px-3 rounded-lg bg-[#dcd1ca] text-[24px] text-[#bd9095] outline-none"
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
          <button
            type="submit"
            className="tracking-[0.15em] font-semibold text-[22px] bg-[#f47e67] rounded-full py-[15px] w-[240px] ease-linear duration-150 flex justify-center"
            onMouseEnter={() => setIsHoverButton(true)}
            onMouseLeave={() => setIsHoverButton(false)}
          >
            SIGN IN{" "}
            <span
              className={`${
                isHoverButton ? " w-5 opacity-100 pl-5" : " w-0 opacity-0 pl-0"
              } duration-200 ease-linear inline-block`}
            >
              &raquo;
            </span>
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default Login;
