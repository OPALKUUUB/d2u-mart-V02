import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ReactLoading from "react-loading";
import Loading from "../../../../Admin/components/Loading";
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Table,
} from "react-bootstrap";

export default function YahooPayment() {
  const [orders, setOrders] = useState([]);
  const [payment, setPayment] = useState([]);
  const [slip, setSlip] = useState("");
  const [continuePaymentModalShow, setContinuePaymentModalShow] =
    useState(false);
  const [slipModalShow, setSlipModalShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const FetchPayment = async () => {
      const result = await fetch("/api/yahoo/payment", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      }).then((res) => res.json());
      // check status
      if (result.status) {
        setOrders(result.data);
        setLoading(false);
      } else {
        if (result.error === "jwt") {
          alert("Your Login Session Is Expired,\nPlease Sign In Again!");
          localStorage.removeItem("token");
        } else {
          alert(result.message);
        }
        window.location.reload(false);
      }
    };
    FetchPayment();
  }, []);

  const handleCheckBox = (e, item) => {
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
    setSlipModalShow(true);
  };

  const handleClickPayment = () => {
    if (payment.length === 0) {
      alert("กรุณาเลือกรายการที่ต้องการชำระ!");
    } else {
      setContinuePaymentModalShow(true);
    }
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
            <th>Bid(¥)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {!loading && (
            <>
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
            </>
          )}
        </tbody>
      </Table>

      {/* loading */}
      {loading && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ReactLoading
              type={"bubbles"}
              color={"rgba(0,0,0,0.2)"}
              height={400}
              width={300}
            />
          </div>
        </>
      )}
      {!loading && orders.length === 0 && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "200px" }}
        >
          <h4>ไม่พบรายการที่ต้องชำระ!</h4>
        </div>
      )}
      {/* Modal */}
      <ContinuePaymentModal
        show={continuePaymentModalShow}
        onHide={() => setContinuePaymentModalShow(false)}
        arrItem={payment}
      />
      <ModalSlip
        show={slipModalShow}
        onHide={() => setSlipModalShow(false)}
        src={slip}
      />
      <Button onClick={handleClickPayment}>Payment</Button>
    </>
  );
}

function ContinuePaymentModal(props) {
  const history = useHistory();
  const [payment, setPayment] = useState(props.arrItem);
  const [yen, setYen] = useState("");

  useEffect(() => {
    fetch("/api/yen", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setYen(json.yen);
        } else {
          alert(json.message);
        }
      });
  }, []);
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
                      <img src={item.imgsrc} height="120px" />
                    </Col>
                    <Col>
                      <div>
                        <a href={item.link}>{item.link.split("/")[5]}</a>
                      </div>
                      <div>ราคาที่ประมูลได้: {item.bid} (¥)</div>
                      <div>ค่าโอนในไทย: {item.tranfer_fee_injapan} (฿)</div>
                      <div>ค่าขนส่งในญี่ปุ่น: {item.delivery_in_thai} (¥)</div>
                      <div>
                        รวม:{" "}
                        {Math.round(
                          (item.bid + item.delivery_in_thai) * yen +
                            item.tranfer_fee_injapan
                        )}{" "}
                        (฿)
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
