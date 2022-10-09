import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="w-full flex justify-end bg-[#fef1e7]"
        style={{ fontFamily: '"Prompt", sans-serif' }}
      >
        <div
          className="w-full flex flex-col md:flex-row items-center px-10 py-[30px] gap-8"
          style={{ backgroundImage: "url(/image/background.png)" }}
        >
          <div className="w-full flex flex-col items-center px-10 py-[30px] gap-8">
            <div className="w-full max-w-[700px] flex flex-col items-center md:items-start justify-start gap-1">
              <p className="font-[600] text-[24px]">ติดต่อเรา</p>
              <div className="w-full justify-center md:justify-start items-center gap-[30px] text-[20px]">
                <p className="mb-0">สำนักงานใหญ่ (พระราม3): 02-023-7405</p>
                <p className="mb-0">แผนกแอดมิน: 02-430-2641, 065-820-9905</p>
                <p className="mb-0">Line ID: @delivery2you</p>
                <p className="mb-0">
                  Facebook Page: Delivery2you ชิปปิ้งญี่ปุ่นไทย
                </p>
              </div>
            </div>
            <div className="w-full max-w-[700px] flex flex-col items-center md:items-start justify-start gap-1">
              <p className="font-[600] text-[24px]">สำนักงานใหญ่ (พระราม3)</p>
              <div className="w-full justify-center md:justify-start items-center gap-[30px] text-[20px]">
                <p className="mb-0">พระราม 3 แมนชั่น ถ.พระราม 3</p>
              </div>
            </div>
            <div className="w-full max-w-[700px] flex flex-col items-center md:items-start justify-start gap-1">
              <p className="font-[600] text-[24px]">สำนักงานย่อย (ร่มเกล้า)</p>
              <div className="w-full justify-center md:justify-start items-center gap-[30px] text-[20px]">
                <p className="mb-0">ร่มเกล้า 19/1 ถ.ร่มเกล้า</p>
              </div>
            </div>
          </div>
          <div className="w-full right-0 max-w-[700px] flex flex-col items-center gap-1">
            <p style={{ cursor: "pointer" }} className="font-[600] text-[24px]">
              เกี่ยวกับเรา
            </p>
            <p
              onClick={() => navigate("/home")}
              style={{ cursor: "pointer" }}
              className="font-[600] text-[24px]"
            >
              หน้าแรก
            </p>
            <p
              onClick={() => navigate("/our-service")}
              style={{ cursor: "pointer" }}
              className="font-[600] text-[24px]"
            >
              บริการของเรา
            </p>
            <p style={{ cursor: "pointer" }} className="font-[600] text-[24px]">
              การรับประกัน
            </p>
            <p style={{ cursor: "pointer" }} className="font-[600] text-[24px]">
              คำถามที่พบบ่อย
            </p>
            <p
              onClick={() => navigate("/contact-us")}
              style={{ cursor: "pointer" }}
              className="font-[600] text-[24px]"
            >
              ติดต่อเรา
            </p>
            <p style={{ cursor: "pointer" }} className="font-[600] text-[24px]">
              รีวิว
            </p>
          </div>
        </div>
      </div>
      <div className="w-full h-[70px] flex justify-center items-center bg-[#040629] text-white text-[20px]">
        Copyright © 2022 . All rights reserved.
      </div>
    </>
  );
}

export default Footer;
