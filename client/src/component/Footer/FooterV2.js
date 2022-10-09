import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import { FiPhoneCall } from "react-icons/fi";

const FooterV2 = () => {
  return (
    <>
      <div className="Footer">
        {/* left content */}
        <div className="contact">
          <div className="head">
            <FiPhoneCall /> <span>ติดต่อเรา</span>
          </div>
          <div className="content">
            <span>สำนักงานใหญ่:</span> 02-023-7405
            <br /> <span>แผนกแอดมิน:</span> 02-430-2641, 065-820-9905
            <br />
            <span>
              <i className="fa-brands fa-line"></i>:
            </span>{" "}
            @delivery2you
            <br /> Facebook Page: Delivery2you ชิปปิ้งญี่ปุ่นไทย
            <br />
            ที่อยู่สำนักงานใหญ่: พระราม 3 แมนชั่น ถ.พระราม 3
            <br />
            ที่อยู่สำนักงานย่อย: ร่มเกล้า 19/1 ถ.ร่มเกล้า
          </div>
        </div>
        {/* right content */}
        <div className="nav">
          <Link to="about-us">เกี่ยวกับเรา</Link>
          <Link to="our-service">บริการของเรา</Link>
          <Link to="insurance">การรับประกัน</Link>
          <Link to="qa">คำถามที่พบบ่อย</Link>
          <Link to="review">รีวืว</Link>
        </div>
      </div>
      <div className="copyright">copyrighrt</div>
    </>
  );
};

export default FooterV2;
