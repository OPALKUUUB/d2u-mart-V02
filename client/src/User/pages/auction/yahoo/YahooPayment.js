import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function YahooPayment() {
  const [orders, setOrders] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowSlip, setModalShowSlip] = useState(false);
  const [payment, setPayment] = useState([]);
  const [slip, setSlip] = useState("");
  useEffect(() => {
    fetch("/api/yahoo/payment", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setOrders(json.data);
        } else {
          alert(json.message);
          localStorage.removeItem("token");
          window.location.reload(false);
        }
      });
  }, []);
  const handleCheckBox = (e, item) => {
    // console.log(e.target.checked, id);
    if (e.target.checked) {
      setPayment([item, ...payment]);
    } else {
      let temp = [];
      for (let i = 0; i < payment.length; i++) {
        if (payment[i].id !== item.id) {
          temp.push(payment[i]);
        }
      }
      setPayment(temp);
    }
  };
  const handlePayment = () => {
    setModalShow(true);
  };
  const handleShowSlip = (payment_id) => {
    fetch("/api/payment/slip/" + payment_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setSlip(json.data);
        } else {
          alert(json.message);
        }
      });
    setModalShowSlip(true);
  };
  return (
    <>
      <h2 className="mb-3">Yahoo Payment</h2>
      <Table responsive="md" striped bordered hover size="sm">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>#</th>
            <th>Select</th>
            <th>Date</th>
            <th>Order</th>
            <th>Link</th>
            <th>Bid(yen)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {orders.map((item, index) => (
            <tr key={index}>
              <td className="align-middle">{index + 1}</td>
              <td className="align-middle">
                {item.payment_status === "pending1" && <>pending</>}
                {item.payment_status === "pending2" && (
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckBox(e, item)}
                  />
                )}
                {item.payment_status === "pending3" && (
                  <Button onClick={() => handleShowSlip(item.payment_id)}>
                    Slip
                  </Button>
                )}
              </td>
              <td className="align-middle">{item.created_at}</td>

              <td className="align-middle">
                <img src={item.imgsrc} width={100} />
              </td>
              <td className="align-middle">
                <a href={item.link} target="_blank">
                  {item.link.split("/")[5]}
                </a>
              </td>
              <td className="align-middle">{item.bid} (¥)</td>
              <td className="align-middle">
                {item.payment_status === "pending1" && "รอค่าส่ง"}
                {item.payment_status === "pending2" && "รอการชำระ"}
                {item.payment_status === "pending3" && "รอการตรวจสอบ"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={handlePayment}>Payment</Button>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        arrItem={payment}
      />
      <ModalSlip
        show={modalShowSlip}
        onHide={() => setModalShowSlip(false)}
        src={slip}
      />
    </>
  );
}

function MyVerticallyCenteredModal(props) {
  const history = useHistory();
  const [payment, setPayment] = useState(props.arrItem);
  useEffect(() => {
    setPayment(props.arrItem);
  }, [props.arrItem]);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Order</h4>
        <div
          style={{ height: "50vh", overflowY: "scroll", marginBottom: "20px" }}
        >
          {payment.map((item, index) => (
            <Card style={{ width: "95%" }} key={index}>
              <Card.Body>
                <Container>
                  <Row>
                    <Col xs={6} md={3}>
                      <img src={item.imgsrc} width="120px" />
                    </Col>
                    <Col>
                      <div>{item.link.split("/")[5]}</div>
                      <div>Bid: {item.bid} (yen)</div>
                      <div>Tranfer Fee: {item.tranfer_fee_injapan} (bath)</div>
                      <div>
                        ค่าขนส่งในญี่ปุ่น: {item.delivery_in_thai} (yen)
                      </div>
                    </Col>
                  </Row>
                </Container>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() =>
            history.push({
              pathname: "/auction/yahoo/payment/all",
              state: payment,
            })
          }
        >
          Continue
        </Button>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function ModalSlip(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onClick={props.onHide}
    >
      <img src={props.src} />
    </Modal>
  );
}
