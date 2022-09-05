import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  basketState,
  prevPaymentPathState,
  totalPriceState,
} from "../../../AppStateManagement/ShopAtom";
import BackButt from "../../../component/button/BackButt";
import Resizer from "react-image-file-resizer";
import Basket from "../../../component/Basket/Basket";
import useToken from "../../../hook/useToken";

const testData =
  "ที่อยู่....orem ipsum dolor sit amet, consectetur adipiscing elit. In mattis, eros ac finibus pellentesque, enim urna gravida dui, malesuada semper ipsum nisi at dolor";
const qrCodeImagePath = "/image/Qrtest.jpg";
function Payment() {
  const [isHoverButton, setIsHoverButton] = useState(false);
  const prevPage = useRecoilValue(prevPaymentPathState);
  // const itemInBasket = useRecoilValue(basketState);
  const [itemInBasket, setItemInBasket] = useRecoilState(basketState);
  const totalPrice = useRecoilValue(totalPriceState);
  const navigate = useNavigate();
  const [methodPayment, setMethodPayment] = useState("bank");
  const [deliveryMethod, setDeliveryMethod] = useState("old");
  const [imageFileList, setImageFileList] = useState([]);
  const [bigPicture, setBigPicture] = useState("");
  const { logout } = useToken();
  // let location = useLocation();
  // const timeInputRef = useRef();
  // const amountInputRef = useRef();
  // const newAddressRef = useRef();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (imageFileList.length > 3) {
      let imageList = [...imageFileList];
      imageList.shift();
      setImageFileList(imageList);
    }
  }, [imageFileList]);

  function fileChangedHandler(event) {
    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          900,
          900,
          "JPEG",
          150,
          0,
          (uri) => {
            let imageList = [...imageFileList];
            imageList.push(uri);
            setImageFileList(imageList);
          },
          "Blob"
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  async function handlePayment() {
    if (imageFileList.length > 0) {
      if (window.confirm("dev mode")) {
        let count = 0;
        for (let i = 0; i < itemInBasket.length; i++) {
          count += itemInBasket[i].count;
        }
        // console.log(itemInBasket);
        try {
          await fetch("/api/mart/booking", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              token: JSON.parse(localStorage.getItem("token")).token,
            },
            body: JSON.stringify({
              items: itemInBasket,
              price: totalPrice,
              slip_image: imageFileList[0],
              count: count,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              // console.log(data);
              if (data.status) {
                alert("success");
              } else {
                alert(data.message);
                logout();
              }
              setItemInBasket([]);
              navigate("/mart/shop");
            });
        } catch (err) {
          console.log(err);
        }
      }
    } else {
      alert("upload slip!");
    }
  }
  return (
    <div
      className="w-full min-h-screen flex justify-center  bg-[#fdefe4]"
      style={{ fontFamily: '"Prompt", sans-serif' }}
    >
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center lg:items-start bg-[#e6e5e1] gap-5 lg:gap-0 justify-center pt-[120px] pb-[60px] px-[50px] relative overflow-x-clip">
        <div className="hidden lg:flex top-30 -right-[10px] absolute">
          <img
            src={"/image/SakuraWithLantern.png"}
            alt=""
            className="w-[600px]"
          />
        </div>
        <div
          className={`w-[150px] h-[50px] rounded-full bg-[#100f28] flex justify-center items-center absolute top-7 left-[50px] cursor-pointer text-[18px] text-white font-semibold ease-linear duration-200`}
          onMouseEnter={() => setIsHoverButton(true)}
          onMouseLeave={() => setIsHoverButton(false)}
          onClick={() => navigate(prevPage)}
        >
          <span
            className={`${
              isHoverButton ? " w-5 opacity-100 pl-3" : " w-0 opacity-0 pl-0"
            } rotate-180 duration-200 ease-linear inline-block`}
          >
            &raquo;
          </span>{" "}
          กลับ
        </div>

        <div className="w-full flex flex-col gap-5 justify-start">
          {/* qr code component */}
          <div className="w-full flex flex-col items-start gap-4">
            <p className="m-0 text-[24px] font-semibold text-[#52514f]">
              รูปแบบการชำระเงิน
            </p>
            <div className="flex items-center gap-[20px] pl-1">
              <div
                className={`w-[25px] h-[25px] rounded-full border-2 border-[#bf8c90] cursor-pointer ${
                  methodPayment === "bank" && "bg-[#be8a97]"
                }`}
              ></div>
              <p className="m-0 text-[20px] text-[#3d3c3b]">
                ชำระผ่านบัญชีธนาคาร
              </p>
            </div>
            <div className="flex relative">
              <img
                src={"/image/vertical-dots.png"}
                alt=""
                className="hidden lg:flex absolute top-0 -right-[62px] w-[38px]"
              />
              <img
                // src={qrCodeImagePath}
                alt=""
                className="w-[380px] h-[600px] object-cover"
              />
            </div>
          </div>
          {/* upload slip component */}
          <div className="w-full flex flex-col items-center gap-4 max-w-[380px]">
            <div className="w-full flex items-center gap-3 justify-center">
              {imageFileList.map((image, index) => (
                <div
                  key={`previewEvidenceImage${index}`}
                  className="relative cursor-pointer"
                  onClick={() => setBigPicture(image)}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-[80px] h-[140px] object-cover rounded-lg"
                  />
                  <div
                    className=" absolute -top-[8px] -right-[8px] flex justify-center items-center text-white p-1 rounded-full bg-[#100f28] border-[2px] border-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFileList(
                        imageFileList.filter(
                          (keepImage, newIndex) => newIndex !== index
                        )
                      );
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <label className="w-[180px] h-[45px] rounded-full text-[18px] flex justify-center items-center cursor-pointer bg-[#b1b3b0] mt-2 font-semibold">
              UPLOAD
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  fileChangedHandler(e);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          {/* button pay component */}
          <div className="w-full flex justify-center">
            <div className="w-full  max-w-[280px] flex flex-col items-center gap-4">
              <div
                className="w-full rounded-full h-[80px] bg-[#eb7470] font-bold text-[30px] flex justify-center items-center cursor-pointer active:bg-[#5b2d2c] ease-linear duration-200"
                onClick={handlePayment}
              >
                ชำระเงิน
              </div>
              <p className="text-[18px] text-center max-w-[200px] text-[#3d3c3b]">
                ตรวจสอบข้อมูลให้ถูกต้องก่อนการชำระเงิน
              </p>
            </div>
          </div>
        </div>
      </div>
      {bigPicture !== "" && (
        <div
          className="w-full min-h-screen h-full fixed top-0 left-0 z-[1200] bg-[#000000ac] flex justify-center items-center"
          onClick={() => setBigPicture("")}
        >
          <img src={bigPicture} alt="" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-11 w-11 text-white absolute top-5 right-5 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            onClick={() => setBigPicture("")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      )}
      <Basket />
    </div>
  );
}

export default Payment;
