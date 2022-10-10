import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import { FiPhoneCall } from "react-icons/fi";
import Line from "../icon/Line";
import Facebook from "../icon/Facebook";

const FooterV2 = () => {
  return (
    <>
      <div className="Footer">
        <div className="contact">
          <div className="head">
            <FiPhoneCall /> <span>ติดต่อเรา</span>
          </div>
          <div className="content">
            <span>สำนักงานใหญ่:</span> 02-023-7405
            <br />
            <span>แผนกแอดมิน:</span> 02-430-2641, 065-820-9905
            <br />
            ที่อยู่สำนักงานใหญ่: พระราม 3 แมนชั่น ถ.พระราม 3
            <br />
            ที่อยู่สำนักงานย่อย: ร่มเกล้า 19/1 ถ.ร่มเกล้า
          </div>
        </div>
        <div className="nav">
          <Link to="about-us">เกี่ยวกับเรา</Link>
          <Link to="our-service">บริการของเรา</Link>
          <Link to="insurance">การรับประกัน</Link>
          <Link to="qa">คำถามที่พบบ่อย</Link>
          <Link to="review">รีวิว</Link>
        </div>
        <hr style={{ width: "100%", height: "2px", color: "black" }} />
        <div className="copyright">
          Copyright © 2022 All Right Reserved By OPALKUUUB
        </div>
        <div className="social">
          <a href="https://liff.line.me/1645278921-kWRPP32q/?accountId=delivery2you">
            <Line width="50" height="50" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=100047724652099">
            <Facebook width="50" height="50" />
          </a>
        </div>
      </div>
    </>
  );
};

export default FooterV2;
