import React, { useEffect } from "react";
import { Col, Container, Figure, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import { useHistory } from "react-router-dom";

export default function Auction() {
  const navigate = useNavigate();
  // const history = useHistory();
  useEffect(() => {
    const CheckSession = async () => {
      await fetch("/check/session", {
        headers: { token: JSON.parse(localStorage.getItem("token")).token },
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          if (!json.status) {
            alert(json.message);
            localStorage.removeItem("token");
            window.location.reload(false);
          }
        });
    };
    CheckSession();
  }, []);
  return (
    <div
      style={{
        background: "#fdeee4",
        height: "100%",
      }}
    >
      <div style={{ width: "80vw", margin: "0 auto" }}>
        <h3
          style={{
            textAlign: "center",
            paddingTop: "20px",
            marginBottom: "20px",
            fontWeight: "700",
          }}
        >
          เลือกทำรายการ
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            columnGap: "150px",
          }}
        >
          <Figure
            // onClick={() => history.push("/auction/yahoo")}
            onClick={() => navigate("/auction/yahoo")}
            style={{ cursor: "pointer" }}
          >
            <Figure.Image width={200} src="/resource/auction.png" />
            <Figure.Caption style={{ fontSize: "1rem" }}>
              ส่งลิงค์ประมูล
            </Figure.Caption>
          </Figure>
          <Figure
            // onClick={() => history.push("/auction/yahoo/order")}
            onClick={() => navigate("/auction/yahoo/order")}
            style={{ cursor: "pointer" }}
          >
            <Figure.Image width={200} src="/resource/shopping-cart.png" />
            <Figure.Caption style={{ fontSize: "1rem" }}>
              รายการสั่งซื้อสินค้า
            </Figure.Caption>
          </Figure>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            columnGap: "150px",
          }}
        >
          <Figure
            // onClick={() => history.push("/auction/yahoo/payment")}
            onClick={() => navigate("/auction/yahoo/payment")}
            style={{ cursor: "pointer" }}
          >
            <Figure.Image width={200} src="/resource/hand.png" />
            <Figure.Caption style={{ fontSize: "1rem" }}>
              รายการสินค้าที่ต้องชำระ
            </Figure.Caption>
          </Figure>
          <Figure
            // onClick={() => history.push("/auction/yahoo/history")}
            onClick={() => navigate("/auction/yahoo/history")}
            style={{ cursor: "pointer" }}
          >
            <Figure.Image width={200} src="/resource/history.png" />
            <Figure.Caption style={{ fontSize: "1rem" }}>
              ประวัติการสั่งซื้อ
            </Figure.Caption>
          </Figure>
        </div>
      </div>
    </div>
  );
}
