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
import ReactLoading from "react-loading";

export default function PaymentTable() {
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [orders, setOrders] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [temp, setTemp] = useState({});

  const [loading, setLoading] = useState(true);
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
          setLoading(false);
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
  const auctionFilter = (c) => {
    let t = orders;
    if (c === 1 || c === 3) {
      t = t.filter((u) => {
        let regex = new RegExp("(" + username + ")", "gi");
        let match = u.username.match(regex);
        if (match != null) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (c === 2 || c === 3) {
      t = t.filter((u) => {
        let regex = new RegExp("(" + date + ")", "gi");
        let fdate = formatDate(u.created_at);
        let match = fdate.match(regex);
        if (match != null) {
          return true;
        } else {
          return false;
        }
      });
    }
    const handleDelete = (id) => {
      fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status) {
            alert(json.message);
            window.location.reload(false);
          } else {
            alert(json.message);
          }
        });
    };

    return (
      <>
        {t.map((item, index) => (
          <tr key={index}>
            <td className="align-middle">{index + 1}</td>
            <td className="align-middle">
              {parseInt(item.created_at.split("T")[0].split("-")[2])}{" "}
              {month[parseInt(item.created_at.split("T")[0].split("-")[1])]}{" "}
              {parseInt(item.created_at.split("T")[0].split("-")[0])}
            </td>
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
            <td className="align-middle">
              {item.payment_status === "pending1" && "รอค่าส่ง"}
              {item.payment_status === "pending2" && "รอการชำระ"}
              {item.payment_status === "pending3" && "รอการตรวจสอบ"}
              {item.payment_status === "paid" && "ชำระเงินเรียบร้อยแล้ว"}
            </td>
            <td className="align-middle">
              <Button
                size="sm"
                variant="success"
                onClick={() => handleUpdateWin(item)}
              >
                <i class="fas fa-pencil-alt"></i>
              </Button>
              &nbsp;
              <Button
                variant="danger"
                onClick={() => handleDelete(item.id)}
                size="sm"
              >
                <i class="fas fa-times"></i>
              </Button>
            </td>
          </tr>
        ))}
      </>
    );
  };
  function formatDate(date) {
    let temp2 = date.split("T")[0];
    let temp = temp2.split("-");
    let y = parseInt(temp[0]);
    let m = parseInt(temp[1]);
    let d = parseInt(temp[2]);
    return `${d}/${m}/${y}`;
  }

  return (
    <>
      <h3 className="mb-3">Yahoo Payment Table</h3>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
              Date&nbsp;
              <Form.Text className="text-muted">Such as 1/1/2022</Form.Text>
            </Form.Label>
            <Form.Control
              type="text"
              name="date"
              onChange={(e) => setDate(e.target.value)}
              placeholder="D/M/Y"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              ttype="text"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
            />
          </Form.Group>
        </Col>
      </Row>
      <Table responsive="md" striped bordered hover size="sm">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Order</th>
            <th>Username</th>
            <th>Link</th>
            <th>Bid(yen)</th>
            <th>tranfer fee(bath)</th>
            <th>delivery(yen)</th>
            <th>Payment Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {date === "" && username !== "" && auctionFilter(1)}
          {date !== "" && username === "" && auctionFilter(2)}
          {date !== "" && username !== "" && auctionFilter(3)}
          {date === "" && username === "" && auctionFilter(4)}
        </tbody>
      </Table>
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
  const [slip, setSlip] = useState("");
  const [modalShowSlip, setModalShowSlip] = useState(false);
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
                  <Form.Label>Bid(yen)</Form.Label>
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
                  <Form.Label>tranfer fee(bath)</Form.Label>
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
                  <Form.Label>delivery(yen)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="delivery"
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
                    <option value="pending1">รอค่าส่ง</option>
                    <option value="pending2">รอการชำระ</option>
                    <option value="pending3">รอการตรวจสอบ</option>
                    <option value="paid">ชำระเงินเรียบร้อยแล้ว</option>
                  </Form.Select>
                </Form.Group>
              </Form>
              {item.payment_id !== null && (
                <Button onClick={() => handleShowSlip(item.payment_id)}>
                  Slip
                </Button>
              )}
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
      <ModalSlip
        show={modalShowSlip}
        onHide={() => setModalShowSlip(false)}
        src={slip}
      />
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

const month = {
  1: "JAN",
  2: "FEB",
  3: "MAR",
  4: "APR",
  5: "MAY",
  6: "JUN",
  7: "JUL",
  8: "AUG",
  9: "SEPT",
  10: "OCT",
  11: "NOV",
  12: "DEC",
};
