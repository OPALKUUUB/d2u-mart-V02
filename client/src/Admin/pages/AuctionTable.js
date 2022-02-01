import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function AuctionTable() {
  const [orders, setOrders] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [id, setId] = useState("");
  useEffect(() => {
    fetch("/api/admin/yahoo/auction", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("AdminToken"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setOrders(json.data);
        } else {
          alert(json.message);
          localStorage.removeItem("AdminToken");
          window.location.reload(false);
        }
      });
  }, []);

  const handleUpdateWin = (id) => {
    setModalShow(true);
    setId(id);
  };

  const handleUpdateLose = (id) => {
    if (window.confirm("Confirm to change status to lose?")) {
      fetch("/api/admin/lose", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("AdminToken"),
        },
        body: JSON.stringify({ id: id }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status) {
            alert(json.message);
          } else {
            alert(json.message);
            localStorage.removeItem("AdminToken");
          }
          window.location.reload(false);
        });
    }
  };

  return (
    <>
      <h3 className="mb-3">Yahoo Auction Table</h3>
      <Table responsive="md" striped bordered hover size="sm">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Order</th>
            <th>Username</th>
            <th>Link</th>
            <th>Maxbid</th>
            <th>Addbid1</th>
            <th>Addbid2</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {orders.map((item, index) => (
            <tr key={index}>
              <td className="align-middle">{index + 1}</td>
              <td className="align-middle">{item.created_at}</td>
              <td className="align-middle">
                <img src={item.imgsrc} width={100} />
              </td>
              <td className="align-middle">{item.username}</td>
              <td className="align-middle">
                <a href={item.link} target="_blank">
                  {item.link.split("/")[5]}
                </a>
              </td>
              <td className="align-middle">
                <div>
                  <span>{item.maxbid} (¥)</span>
                  <br />
                  <span>
                    <WorkBy item={item} by={item.maxbid_work_by} mode={1} />
                  </span>
                </div>
              </td>
              <td className="align-middle">
                {item.addbid1 === null ? (
                  "-"
                ) : (
                  <div>
                    <span>{item.addbid1} (¥)</span>
                    <br />
                    <span>
                      <WorkBy item={item} by={item.addbid1_work_by} mode={2} />
                    </span>
                  </div>
                )}
              </td>
              <td className="align-middle">
                {item.addbid2 === null ? (
                  "-"
                ) : (
                  <div>
                    <span>{item.addbid2} (¥)</span>
                    <br />
                    <span>
                      <WorkBy item={item} by={item.addbid2_work_by} mode={3} />
                    </span>
                  </div>
                )}
              </td>
              <td className="align-middle">
                <Button
                  variant="success"
                  onClick={() => handleUpdateWin(item.id)}
                >
                  win
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => handleUpdateLose(item.id)}
                >
                  lose
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <MydModalWithGrid
        show={modalShow}
        onHide={() => setModalShow(false)}
        id={id}
      />
    </>
  );
}

function WorkBy(props) {
  let item = props.item;
  let by = props.by;
  const [workBy, setWorkBy] = useState(by !== null ? by : "none");
  const [check, setCheck] = useState(by !== null);

  const handleWorkBy = (item) => {
    fetch("/api/admin/workby", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("AdminToken"),
      },
      body: JSON.stringify({
        mode: props.mode,
        id: item.id,
        value: workBy === "none" ? false : true,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.status) {
          alert(json.message);
          localStorage.removeItem("AdminToken");
        } else {
          setWorkBy(json.value !== null ? json.value : "none");
          setCheck(!check);
        }
        window.location.reload(false);
      });
  };
  return (
    <>
      <input
        type="checkbox"
        checked={check}
        onChange={() => handleWorkBy(item)}
      />{" "}
      {workBy}
    </>
  );
}

function MydModalWithGrid(props) {
  const history = useHistory();
  const [bid, setBid] = useState("");
  const [tranferFee, setTranferFee] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [status, setStatus] = useState("");

  const handleUpdateWin = () => {
    let win = {
      id: props.id,
      bid: bid,
      tranferFee: tranferFee,
      deliveryFee: deliveryFee,
      paymentStatus: status,
    };
    // console.log(win);
    fetch("/api/admin/win", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("AdminToken"),
      },
      body: JSON.stringify(win),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          alert(json.message);
          history.push("/admin/table/yahoo/payment");
        } else {
          alert(json.message);
          localStorage.removeItem("AdminToken");
          window.location.reload(false);
        }
      });
  };
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      size="lg"
      fullscreen="sm-down"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update win status
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <Row>
            <Col>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Bid</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter bid"
                    onChange={(e) => setBid(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>tranfer fee in japan</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="tranfer fee in japan"
                    onChange={(e) => setTranferFee(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>delivery in thai</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="delivery in thai"
                    onChange={(e) => setDeliveryFee(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>payment status</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="pending1">select option</option>
                    <option value="pending1">รอค่าส่ง</option>
                    <option value="pending2">รอการชำระ</option>
                    <option value="pending3">รอการตรวจสอบ</option>
                    <option value="paid">ชำระเงินเรียบร้อยแล้ว</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpdateWin} variant="primary">
          Confirm
        </Button>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
