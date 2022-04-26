import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../components/Loading";
import {
  Button,
  Col,
  Container,
  Dropdown,
  FloatingLabel,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";

export default function AuctionTable() {
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [orders, setOrders] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [notedModal, setNotedModal] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [trigger, setTrigger] = useState(false);
  const [temp, setTemp] = useState({});
  useEffect(() => {
    const fetchOrders = async () => {
      const result = await fetch(
        `/api/admin/yahoo/order?username=${username}&date=${date}`,
        {
          headers: {
            token: localStorage.getItem("AdminToken"),
          },
        }
      ).then((res) => res.json());
      if (result.status) {
        setOrders(result.data);
      } else {
        alert("fetch fail from history yahoo!");
      }
      setLoading(false);
      setLoading2(false);
    };
    setLoading(true);
    fetchOrders();
  }, [username, date, trigger]);

  const handleUpdateLose = (index, id) => {
    if (window.confirm("Confirm to change status to lose?")) {
      setOrders([...orders.slice(0, index), ...orders.slice(index + 1)]);
      fetch("/api/admin/yahoo/order/lose", {
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
            // setTrigger(!trigger);
            console.log("delete done!");
          } else {
            alert(json.message);
            if (json.error === "jwt") {
              localStorage.removeItem("AdminToken");
            }
            window.location.reload(false);
          }
        });
    }
  };

  const handleUpdateWin = (id) => {
    setId(id);
    setModalShow(true);
  };

  const handleAddNoted = (id, noted) => {
    setTemp({ id: id, noted: noted });
    setNotedModal(true);
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
            <th>Noted</th>
            <th></th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {!loading && (
            <>
              {orders.map((item, index) => (
                <tr key={index}>
                  <td className="align-middle">{index + 1}</td>
                  <td className="align-middle">
                    {parseInt(item.created_at.split("T")[0].split("-")[2])}{" "}
                    {
                      month[
                        parseInt(item.created_at.split("T")[0].split("-")[1])
                      ]
                    }{" "}
                    {parseInt(item.created_at.split("T")[0].split("-")[0])}
                  </td>
                  <td className="align-middle">
                    <img src={item.imgsrc} width={100} />
                  </td>
                  <td className="align-middle">{item.username}</td>
                  <td className="align-middle">
                    <a href={item.link} target="_blank">
                      link
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
                          setTrigger={setTrigger}
                          trigger={trigger}
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
                            setTrigger={setTrigger}
                            trigger={trigger}
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
                            setTrigger={setTrigger}
                            trigger={trigger}
                          />
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="align-middle" width={100}>
                    {item.remark === null ? "-" : <>{item.remark}</>}
                  </td>
                  <td className="align-middle">
                    {item.noted !== null && item.noted !== ""
                      ? item.noted
                      : "-"}
                  </td>
                  <td className="align-middle">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="success"
                        id="dropdown-basic"
                        size="sm"
                      >
                        manage
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleUpdateWin(item.id)}>
                          win
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleUpdateLose(index, item.id)}
                        >
                          lose
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          onClick={() => handleAddNoted(item.id, item.noted)}
                        >
                          noted
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    {/* <Button
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
                    </Button> */}
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </Table>
      {!loading2 && loading && <Loading load={1} />}
      {loading2 && <Loading />}
      <ChangeWinModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        id={id}
      />
      <NotedModal
        show={notedModal}
        onHide={() => setNotedModal(false)}
        item={temp}
        trigger={trigger}
        setTrigger={setTrigger}
      />
    </>
  );
}

function NotedModal(props) {
  const [noted, setNoted] = useState(props.item.noted);
  useEffect(() => {
    console.log(props.item);
    if (props.item.noted !== noted) {
      setNoted(props.item.noted === null ? "" : props.item.noted);
    }
  }, [props.item]);
  const handleAddNoted = () => {
    const PatchNoted = async () => {
      const json = await fetch("/api/admin/yahoo/order/noted", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noted: noted, id: props.item.id }),
      }).then((res) => res.json());

      if (json.status) {
        props.setTrigger(!props.trigger);

        props.onHide();
      } else {
        alert(json.message);
      }
    };
    PatchNoted();
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Add Noted</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FloatingLabel controlId="floatingTextarea2" label="Noted">
          <Form.Control
            as="textarea"
            placeholder="Leave a comment here"
            style={{ height: "100px" }}
            value={noted}
            onChange={(e) => setNoted(e.target.value)}
          />
        </FloatingLabel>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleAddNoted}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
}

function WorkBy(props) {
  const [check, setCheck] = useState(props.by !== "" && props.by !== null);
  const [admin, setAdmin] = useState(props.by !== null ? props.by : "-");
  const handleWorkBy = () => {
    fetch("/api/admin/yahoo/order/workby", {
      method: "PATCH",
      headers: {
        token: localStorage.getItem("AdminToken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: props.mode,
        id: props.item.id,
        value: props.by !== "" && props.by !== null,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setCheck(!check);
          if (admin === "-") {
            setAdmin(json.value);
          } else {
            setAdmin("-");
          }
        } else {
          alert(json.message);
        }
      });
  };
  return (
    <>
      <input type="checkbox" checked={check} onChange={handleWorkBy} /> {admin}
    </>
  );
}

function ChangeWinModal(props) {
  const history = useHistory();
  const [bid, setBid] = useState(0);
  const [tranferFee, setTranferFee] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const handleUpdateWin = () => {
    let win = {
      id: props.id,
      bid: bid,
      tranferFee: tranferFee,
      deliveryFee: deliveryFee,
      paymentStatus: status,
    };

    const FetchUpdateWin = async () => {
      const result = await fetch("/api/admin/yahoo/order/win", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("AdminToken"),
        },
        body: JSON.stringify(win),
      }).then((res) => res.json());
      if (result.status) {
        setLoading(false);
        history.push("/admin/table/yahoo/payment");
      } else {
        if (result.error === "jwt") {
          alert("Your Login Session Is Expired,\nPlease Sign In Again!");
          localStorage.removeItem("AdminToken");
        } else {
          alert(result.message);
        }
        window.location.reload(false);
      }
    };
    if (status === "") {
      alert("กรุณาเลือก payment status ก่อน!");
    } else {
      if (window.confirm("คุณแน่ใจที่จะเปลี่ยนสถานะของรายการนี้เป็นชนะ?")) {
        setLoading(true);
        FetchUpdateWin();
      }
    }
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
                    <option>select option</option>
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
      {loading && <Loading />}
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
