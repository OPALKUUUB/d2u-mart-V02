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
import ReactLoading from "react-loading";
import Loading from "../components/Loading";

export default function AuctionTable() {
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [orders, setOrders] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      const result = await fetch(
        `/api/admin/yahoo/auction?username=${username}&date=${date}`
      ).then((res) => res.json());
      if (result.status) {
        setOrders(result.data);
      } else {
        alert("fetch fail from history yahoo!");
      }
    };
    fetchOrders();
    setLoading(false);
  }, [username, date, loading]);

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
            window.location.reload(false);
          }
        });
    }
  };

  return (
    <>
      <h3 className="mb-3">Yahoo Auction Table</h3>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>
              Date&nbsp;
              <Form.Text className="text-muted">Such as 1/1/2022</Form.Text>
            </Form.Label>
            <Form.Control
              type="date"
              name="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              value={username}
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
            <th>Maxbid</th>
            <th>Addbid1</th>
            <th>Addbid2</th>
            <th>Remark</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {orders.map((item, index) => (
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
                <div>
                  <span>{item.maxbid} (¥)</span>
                  <br />
                  <span>
                    <WorkBy
                      item={item}
                      by={item.maxbid_work_by}
                      mode={1}
                      setLoading={setLoading}
                    />
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
                      <WorkBy
                        item={item}
                        by={item.addbid1_work_by}
                        mode={2}
                        setLoading={setLoading}
                      />
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
                      <WorkBy
                        item={item}
                        by={item.addbid2_work_by}
                        mode={3}
                        setLoading={setLoading}
                      />
                    </span>
                  </div>
                )}
              </td>
              <td className="align-middle" width={100}>
                {item.remark === null ? "-" : <>{item.remark}</>}
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
        id={id}
      />
    </>
  );
}

function WorkBy(props) {
  const [workBy, setWorkBy] = useState("");
  const [check, setCheck] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (props.mode === 1) {
      if (
        props.item.maxbid_work_by !== "" &&
        props.item.maxbid_work_by !== null
      ) {
        setWorkBy(props.item.maxbid_work_by);
        setCheck(true);
      } else {
        setWorkBy("none");
        setCheck(false);
      }
    }
    if (props.mode === 2) {
      if (
        props.item.addbid1_work_by !== "" &&
        props.item.addbid1_work_by !== null
      ) {
        setWorkBy(props.item.addbid1_work_by);
        setCheck(true);
      } else {
        setWorkBy("none");
        setCheck(false);
      }
    }
    if (props.mode === 3) {
      if (
        props.item.addbid2_work_by !== "" &&
        props.item.addbid2_work_by !== null
      ) {
        setWorkBy(props.item.addbid2_work_by);
        setCheck(true);
      } else {
        setWorkBy("none");
        setCheck(false);
      }
    }
  }, [props, check]);

  const handleWorkBy = () => {
    setLoading(true);
    setCheck(!check);
    fetch("/api/admin/workby", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("AdminToken"),
      },
      body: JSON.stringify({
        mode: props.mode,
        id: props.item.id,
        value: check,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.status) {
          alert(json.message);
          localStorage.removeItem("AdminToken");
        } else {
          setWorkBy(json.value !== null ? json.value : "none");
        }
        props.setLoading(true);
        setLoading(false);
      });
  };
  return (
    <>
      <input type="checkbox" checked={check} onChange={handleWorkBy} /> {workBy}
      {loading && <Loading />}
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
                  <Form.Label>Bid(yen)</Form.Label>
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
                  <Form.Label>tranfer fee(bath.)</Form.Label>
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
                  <Form.Label>delivery in japan(yen)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="delivery in japan"
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
