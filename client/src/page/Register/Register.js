import React, { useState } from "react";
<<<<<<< HEAD
import { FloatingLabel, Form } from "react-bootstrap";
=======
import { Form } from "react-bootstrap";
>>>>>>> c1c69b78506818ed4dfb8e4ce94859c9699afe8e
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
export const Register = () => {
  const navigate = useNavigate();
  const [register, setRegister] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    confirm_password: "",
    address_case: "มารับเอง",
    address: "",
  });
  const [alertUsername, setAlertUsername] = useState(null);
  const [alertPassword, setAlertPassword] = useState(null);
  const [isHoverButton, setIsHoverButton] = useState(false);
  const handleChange = (e) => {
    if (e.target.name === "case") {
      setRegister({
        ...register,
        address: "",
        [e.target.name]: e.target.value,
      });
    } else {
      setRegister({ ...register, [e.target.name]: e.target.value });
    }
    if (e.target.name === "username") {
      var re_un = new RegExp("^[a-z]{4,18}$");
      if (e.target.value.match(re_un) === null) {
        setAlertUsername(true);
      } else {
        setAlertUsername(false);
      }
    }
    if (e.target.name === "password") {
      var re_ps = new RegExp("^\\w[\\w.]{4,18}\\w$");
      if (e.target.value.match(re_ps) === null) {
        setAlertPassword(true);
      } else {
        setAlertPassword(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let check = true;
    var re_ps = new RegExp("^\\w[\\w.]{4,18}\\w$");
    var re_un = new RegExp("^[a-z]{4,18}$");
    if (register.password.match(re_ps) === null) {
      check = false;
      alert("Please match format password that we required!");
    }
    if (register.username.match(re_un) === null) {
      check = false;
      alert("Please match format Username that we required!");
    }

    if (IsNotEmpty(register) && check) {
      if (ConfirmPassword(register)) {
        fetch("/api/user/customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(register),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status) {
              alert("Register is successfully");
              setRegister({
                name: "",
                username: "",
                phone: "",
                password: "",
                confirm_password: "",
                address_case: "มารับเอง",
                address: "",
              });
              navigate("/login");
            } else {
              alert("Register is fail with Error: " + result.message);
            }
          })
          .catch((err) => console.log(err));
      } else {
        alert("In field confirm password is not match with password field!!!");
      }
    } else {
      alert("Please fill every input");
    }
  };
  return (
    <div
      className="relative flex justify-center pt-10 pb-80 sm:pb-96"
      style={{
        background: "#fdeee4",
        width: "100vw",
        height: "100%",
        fontFamily: '"Prompt", sans-serif',
      }}
    >
      <img
        src="/image/sakura-rotate.png"
        alt=""
        className="top-20 -right-5 absolute w-[500px] object-cover object-center hidden lg:flex"
      />
      <img
        src="/image/welcome2.png"
        alt=""
        className="top-48 left-28 absolute h-[500px] object-cover object-center hidden lg:flex"
      />
      <img
        src="/image/torii.png"
        alt=""
        className="bottom-0 left-1/2 transform -translate-x-1/2 absolute h-[240px] sm:h-[320px] object-cover object-center flex z-10"
      />
      <img
        src="/image/barbgon-horizontal.png"
        alt=""
        className="bottom-0 absolute w-full h-[130px] object-cover object-center flex"
      />
      <img
        src="/image/ciecle.png"
        alt=""
        className="hidden sm:flex absolute bottom-44 right-20 w-[50px]"
      />
      <img
        src="/image/bird.png"
        alt=""
        className="hidden md:flex absolute bottom-60 left-[500px] w-[120px]"
      />
      <div className=" w-full max-w-[550px] px-4 pt-[30px] flex justify-center">
        <form className="flex flex-col w-full items-center gap-10 z-10">
          <motion.h1
            className="tracking-[0.05em] leading-[70px] text-[36px] md:text-[50px]"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            REGISTER
          </motion.h1>
          <motion.div
            className="flex flex-col w-full items-start gap-[10px]"
            controlid="formHorizontalEmail"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <label className="tracking-[0.05em] text-[16px] md:text-[18px]">
              FIRST NAME - LAST NAME
            </label>
            <input
              className="w-full py-2 px-[18px] rounded-lg bg-[#dcd1ca] text-[18px] md:text-[22px] text-[#bd9095] placeholder:text-[#bd9095] outline-none"
              type="text"
              placeholder="Enter Name"
              name="name"
              onChange={handleChange}
            />
          </motion.div>
          <motion.div
            className="flex flex-col w-full items-start gap-[10px]"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          >
            <label className="tracking-[0.05em] text-[16px] md:text-[18px]">
              USERNAME
            </label>
            <input
              className="w-full py-2 px-[18px] rounded-lg bg-[#dcd1ca] text-[18px] md:text-[22px] text-[#bd9095] placeholder:text-[#bd9095] outline-none"
              type="text"
              placeholder="Enter Username"
              name="username"
              onKeyPress={(event) => {
                if (
                  !/[a-z]/.test(event.key) ||
                  event.target.value.length > 14
                ) {
                  event.preventDefault();
                }
              }}
              onChange={handleChange}
            />
            {alertUsername && (
              <span style={{ color: "#ef3d39" }}>
                Your username must be 4-18 characters long, container only a-z
              </span>
            )}
          </motion.div>
          <motion.div
            className="flex flex-col w-full items-start gap-[10px]"
            controlid="formHorizontalEmail"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
          >
            <label className="tracking-[0.05em] text-[16px] md:text-[18px]">
              MOBILE
            </label>
            <input
              className="w-full py-2 px-[18px] rounded-lg bg-[#dcd1ca] text-[18px] md:text-[22px] text-[#bd9095] placeholder:text-[#bd9095] outline-none"
              type="tel"
              placeholder="Enter Phone"
              name="phone"
              onKeyPress={(event) => {
                if (
                  !/[0-9]/.test(event.key) ||
                  event.target.value.length > 10
                ) {
                  event.preventDefault();
                }
              }}
              onChange={handleChange}
            />
          </motion.div>
          <motion.div
            className="flex flex-col w-full items-start gap-[10px]"
            controlid="formHorizontalPassword"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 1.7 }}
          >
            <label className="tracking-[0.05em] text-[16px] md:text-[18px]">
              PASSWORD
            </label>
            <input
              className="w-full py-2 px-[18px] rounded-lg bg-[#dcd1ca] text-[18px] md:text-[22px] text-[#bd9095] placeholder:text-[#bd9095] outline-none"
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleChange}
            />
            {alertPassword && (
              <span id="passwordHelpBlock" style={{ color: "#ef3d39" }}>
                Your password must be 4-18 characters long, container only a-z,
                A-Z, 0-9
              </span>
            )}
          </motion.div>
          <motion.div
            className="flex flex-col w-full items-start gap-[10px]"
            controlid="formHorizontalPassword"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <label className="tracking-[0.05em] text-[16px] md:text-[18px]">
              CONFIRM PASSWORD
            </label>
            <input
              className="w-full py-2 px-[18px] rounded-lg bg-[#dcd1ca] text-[18px] md:text-[22px] text-[#bd9095] placeholder:text-[#bd9095] outline-none"
              type="password"
              placeholder="Enter Confirm Password"
              name="confirm_password"
              onChange={handleChange}
            />
          </motion.div>
          <fieldset className="w-full flex flex-col">
            <motion.div
              className="flex flex-col w-full items-start gap-[10px]"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 2.3 }}
            >
              <label className="tracking-[0.05em] text-[18px] md:text-[20px]">
                รูปแบบการจัดส่ง
              </label>

              <Form.Check
                type="radio"
                label="มารับเอง"
                name="address_case"
                id="formHorizontalRadios1"
                value="มารับเอง"
                checked={register.address_case === "มารับเอง"}
                onChange={handleChange}
              />
              <Form.Check
                type="radio"
                label="ขนส่งในประเทศ"
                name="address_case"
                id="formHorizontalRadios2"
                value="ขนส่งในประเทศ"
                checked={register.address_case === "ขนส่งในประเทศ"}
                onChange={handleChange}
              />
            </motion.div>
          </fieldset>
          {register.address_case === "มารับเอง" && (
            <fieldset className="w-full flex flex-col">
              <motion.div
                className="flex flex-col w-full items-start gap-[10px]"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <label className="tracking-[0.05em] text-[18px] md:text-[20px]">
                  กรณีที่มารับเอง สามารถเลือกสถานที่ได้ดังนี้
                </label>

                <Form.Check
                  type="radio"
                  label="พระราม3 ซอย35 (พระราม3 แมนชั่น)"
                  value="พระราม3 ซอย35 (พระราม3 แมนชั่น)"
                  name="address"
                  onChange={handleChange}
                />
                <Form.Check
                  type="radio"
                  label="ถนนร่มเกล้า 19/1"
                  value="ถนนร่มเกล้า 19/1"
                  name="address"
                  onChange={handleChange}
                />
              </motion.div>
            </fieldset>
          )}
          {register.address_case === "ขนส่งในประเทศ" && (
            <>
              <motion.div
                className="flex flex-col w-full items-start gap-[10px]"
                controlid="formGroupPassword"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                end={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <label className="tracking-[0.05em] text-[18px] md:text-[20px]">
                  กรณีขนส่งในประเทศ{" "}
                  <span className="text-[16px]">
                    {"(กรอกที่อยู่ในการจัดส่ง)"}
                  </span>
                </label>
                <textarea
                  rows={3}
                  className="resize-none w-full rounded-lg px-3 py-2 outline-none placeholder:text-[18px] text-[#a08689] text-[18px] md:text-[20px] placeholder:text-[#a08689] bg-[#e0dbd8]"
                  placeholder="กรอกรายละเอียดสถานที่จัดส่ง..."
                  label="Address"
                  onChange={(e) =>
                    setRegister({ ...register, address: e.target.value })
                  }
                />
              </motion.div>
            </>
          )}
          <motion.button
            className="tracking-[0.15em] font-semibold text-[18px] md:text-[22px] bg-[#f47e67] rounded-full py-[15px] w-[180px] md:w-[240px] ease-linear duration-150 flex justify-center"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 2.9 }}
            onMouseEnter={() => setIsHoverButton(true)}
            onMouseLeave={() => setIsHoverButton(false)}
            onClick={handleSubmit}
          >
            {" "}
            REGISTER
            <span
              className={`${
                isHoverButton ? " w-5 opacity-100 pl-3" : " w-0 opacity-0 pl-0"
              } duration-200 ease-linear inline-block`}
            >
              &raquo;
            </span>
          </motion.button>
        </form>
      </div>
    </div>
  );
};

function IsNotEmpty(obj) {
  for (var key in obj) {
    if (obj[key] === "") return false;
  }
  return true;
}

function ConfirmPassword(item) {
  return item.password === item.confirm_password;
}
