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

export default function PaymentTable() {
  const [orders, setOrders] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [temp, setTemp] = useState({});
  useEffect(() => {
    fetch("/api/admin/yahoo/payment", {
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
  const handleUpdateWin = (item) => {
    setModalShow(true);
    setTemp(item);
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
            <th>Bid</th>
            <th>tranfer fee</th>
            <th>delivery</th>
            <th>Payment Status</th>
            <th>Config</th>
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
                <div>{item.bid} (¥)</div>
                <div style={{ backgroundColor: "yellow" }}>{item.bid_by}</div>
              </td>
              <td className="align-middle">{item.tranfer_fee_injapan}</td>
              <td className="align-middle">{item.delivery_in_thai}</td>
              <td className="align-middle">{item.payment_status}</td>
              <td className="align-middle">
                <Button variant="warning" onClick={() => handleUpdateWin(item)}>
                  Config
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <MydModalWithGrid
        show={modalShow}
        onHide={() => setModalShow(false)}
        item={temp}
      />
    </>
  );
}

function MydModalWithGrid(props) {
  const [item, setItem] = useState(props.item);
  useEffect(() => {
    setItem(props.item);
  }, [props.item]);
  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };
  const handleUpdateWin = () => {
    let win = {
      id: item.id,
      bid: item.bid,
      tranferFee: item.tranfer_fee_injapan,
      deliveryFee: item.delivery_in_thai,
      paymentStatus: item.payment_status,
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
        } else {
          alert(json.message);
          localStorage.removeItem("AdminToken");
        }
        window.location.reload(false);
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
                    name="bid"
                    onChange={handleChangeItem}
                    value={item.bid}
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
                    name="tranfer_fee_injapan"
                    onChange={handleChangeItem}
                    value={item.tranfer_fee_injapan}
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
                    name="delivery_in_thai"
                    onChange={handleChangeItem}
                    value={item.delivery_in_thai}
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
                    name="payment_status"
                    onChange={handleChangeItem}
                    value={item.payment_status}
                  >
                    <option value={null}>select option</option>
                    <option value="pending1">pending1</option>
                    <option value="pending2">pending2</option>
                    <option value="pending3">pending3</option>
                    <option value="paid">paid</option>
                  </Form.Select>
                </Form.Group>
              </Form>
              {item.payment_id !== null && <Button>Slip</Button>}
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
