import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../../Admin/components/Loading";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";

export default function YahooAllPayment(props) {
  const [yen, setYen] = useState("");
  const [payment, setPayment] = useState(props.location.state);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [slipImageFilename, setSlipImageFilename] = useState("");
  const [arrId, setArrId] = useState([]);
  const [sum, setSum] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);

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
          setLoading(false);
        } else {
          alert(json.message);
          window.location.reload(false);
        }
      });
  }, []);

  useEffect(() => {
    setPayment(props.location.state);
  }, [props.location.state]);

  const handleSumPayment = () => {
    let temp = 0;
    for (let i = 0; i < payment.length; i++) {
      temp += Math.round(
        (payment[i].bid + payment[i].delivery_in_thai) * yen +
          payment[i].tranfer_fee_injapan
      );
    }
    return temp;
  };

  const handleFileChange = (e) => {
    if (e.target.files[0] === undefined) {
      setFile(null);
      setImage(null);
    } else {
      setFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = () => {
    if (file === null) {
      alert(`กรุณาเลือกใบเสร็จ!`);
    } else {
      const FetchPostImage = async () => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "d2u-service");
        data.append("cloud_name", "d2u-service");
        const result = await fetch(
          "https://api.cloudinary.com/v1_1/d2u-service/upload",
          {
            method: "POST",
            body: data,
          }
        ).then((resp) => resp.json());
        let temp = [];
        for (let i = 0; i < payment.length; i++) {
          temp.push(payment[i].id);
        }
        setArrId(temp);
        setSlipImageFilename(result.url);
        setSum(handleSumPayment());
        setModalShow(true);
        setLoading(false);
      };
      setLoading(true);
      FetchPostImage();
    }
  };

  return (
    <>
      <h3 className="mb-3">Payment</h3>
      <Container>
        <Row>
          <Col md>
            <Card style={{ padding: "10px", marginBottom: "10px" }}>
              <div style={{ height: "300px", overflowY: "scroll" }}>
                {props.location.state.map((item, index) => (
                  <Card style={{ width: "95%" }} key={index}>
                    <Card.Body>
                      <Container>
                        <Row>
                          <Col>
                            <img src={item.imgsrc} width="120px" />
                          </Col>
                          <Col>
                            <div>{item.link.split("/")[5]}</div>
                            <div>Bid: {item.bid} (¥)</div>
                            <div>ค่าโอน: {item.tranfer_fee_injapan} (฿)</div>
                            <div>
                              ค่าขนส่งในญี่ปุ่น: {item.delivery_in_thai} (¥)
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card>
          </Col>
          <Col md>
            <Card>
              <Card.Header>
                Payment
                <span
                  className="text-muted"
                  style={{ fontSize: "0.6rem", float: "right" }}
                >
                  rate is 1 yen : {yen} bath
                </span>
              </Card.Header>
              <Card.Body>
                <blockquote className="blockquote mb-2">
                  <p>
                    Amount Order({props.location.state.length})
                    <br />
                    Sum: {handleSumPayment()} bath
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      border: "1px solid rgba(0,0,0,0.2)",
                      borderRadius: "5px",
                      padding: "5px",
                      background: "rgba(0,0,0,0.1)",
                      color: "rgba(0,0,0,0.8)",
                    }}
                  >
                    สามารถชำระเงินผ่านเลขที่บัญชี: <span>4670686364</span>
                    <br />
                    (ธ.กรุงไทย มนจิรา เดชะชาติ)
                  </p>
                  <Form.Group controlId="formFileSm" className="mb-3">
                    <Form.Label>Upload slip</Form.Label>
                    <Form.Control
                      type="file"
                      size="sm"
                      name="slipImage"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <footer
                    className="blockquote-footer"
                    style={{ fontSize: "0.7rem" }}
                  >
                    Please Upload Slip Before Submit Payment
                  </footer>
                </blockquote>
                <Button onClick={handleUpload}>Submit</Button>
                {/* submit for upload image and show modal for confirm and send to database */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Loadin */}
      {loading && <Loading />}
      {/* Modal */}
      <ConfirmAddSlipModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        image={image}
        slipFilename={slipImageFilename}
        amount={props.location.state.length}
        sum={sum}
        arrId={arrId}
      />
    </>
  );
}

function ConfirmAddSlipModal(props) {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    fetch("/api/payment/confirm", {
      method: "PATCH",
      headers: {
        token: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId: props.arrId,
        slip_image_filename: props.slipFilename,
        price: props.sum,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setLoading(false);
          history.push("/auction/yahoo/payment");
        }
      });
  };
  return (
    <>
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
          <h4>Confirm</h4>
          <p>
            Amount Order({props.amount})
            <br />
            Sum: {props.sum} bath
          </p>
          <img src={props.image} width={100} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>Confirm</Button>
          <Button onClick={props.onHide} variant="secondary">
            Close
          </Button>
        </Modal.Footer>
        {loading && <Loading />}
      </Modal>
    </>
  );
}
