import React from "react";
import { Col, Container, Figure, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function Auction() {
  const history = useHistory();

  return (
    <Container
      style={{
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: "20px", fontWeight: "700" }}>เลือกทำรายการ</h3>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <Figure
            onClick={() => history.push("/auction/yahoo")}
            style={{ cursor: "pointer" }}
          >
            <Figure.Image width={200} src="/resource/auction.png" />
            <Figure.Caption style={{ fontSize: "1rem" }}>
              ส่งลิงค์ประมูล
            </Figure.Caption>
          </Figure>
        </Col>
        <Col md={4}>
          <Figure
            onClick={() => history.push("/auction/yahoo/order")}
            style={{ cursor: "pointer" }}
          >
            <Figure.Image width={200} src="/resource/shopping-cart.png" />
            <Figure.Caption style={{ fontSize: "1rem" }}>
              รายการสั่งซื้อสินค้า
            </Figure.Caption>
          </Figure>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <Figure
            onClick={() => history.push("/auction/yahoo/payment")}
            style={{ cursor: "pointer" }}
          >
            <Figure.Image width={200} src="/resource/hand.png" />
            <Figure.Caption style={{ fontSize: "1rem" }}>
              รายการสินค้าที่ต้องชำระ
            </Figure.Caption>
          </Figure>
        </Col>
        <Col md={4}>
          <Figure
            onClick={() => history.push("/auction/yahoo/history")}
            style={{ cursor: "pointer" }}
          >
            <Figure.Image width={200} src="/resource/history.png" />
            <Figure.Caption style={{ fontSize: "1rem" }}>
              ประวัติการสั่งซื้อ
            </Figure.Caption>
          </Figure>
        </Col>
      </Row>
    </Container>
  );
}
