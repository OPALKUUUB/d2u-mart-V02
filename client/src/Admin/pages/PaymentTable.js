import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
  FloatingLabel,
} from "react-bootstrap";
import Loading from "../components/Loading";

export default function PaymentTable() {
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [orders, setOrders] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [temp, setTemp] = useState({});
  const [tempNoted, setTempNoted] = useState({});
  const [notedModal, setNotedModal] = useState(false);
  const [yen, setYen] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [trigger, setTrigger] = useState(true);
  useEffect(() => {
    const FetchYen = async () => {
      const result = await fetch("/api/yen").then((res) => res.json());
      if (result.status) {
        setYen(result.yen);
      } else {
        alert(result.message);
      }
    };
    FetchYen();
  }, []);
  useEffect(() => {
    const fetchOrder = async () => {
      const result = await fetch(
        `/api/admin/yahoo/payment?username=${username}&date=${date}`,
        {
          headers: {
            token: localStorage.getItem("AdminToken"),
          },
        }
      ).then((res) => res.json());
      if (result.status) {
        setOrders(result.data);
        setLoading(false);
      } else {
        alert(result.message);
        window.localStorage.removeItem("AdminToken");
        window.location.reload(false);
      }
      setLoading(false);
      setLoading2(false);
    };
    setLoading(true);
    fetchOrder();
  }, [date, username, trigger]);

  const handleUpdateWin = (item) => {
    setModalShow(true);
    setTemp(item);
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณต้องการที่จะลบรายการสั่งซื้อนี้ใช้หรือไม่ ?")) {
      setLoading2(true);
      fetch("/api/admin/yahoo/order", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status) {
            setTrigger(!trigger);
          } else {
            alert(json.message);
          }
        });
    }
  };

  const handleCheckInformBill = (check, id) => {
    setLoading2(true);

    fetch("/api/admin/yahoo/order/inform/bill", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ check: !check, id: id }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setTrigger(!trigger);
        } else {
          alert(json.message);
        }
      });
  };

  const handleAddNoted = (id, noted) => {
    setTempNoted({ id: id, noted: noted });
    setNotedModal(true);
  };

  return (
    <>
      <h3 className="mb-3">Yahoo Payment Table</h3>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Date&nbsp;</Form.Label>
            <Form.Control
              type="date"
              name="date"
              onChange={(e) => setDate(e.target.value)}
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
            <th>Bid(¥)</th>
            <th>ค่าโอน(฿)</th>
            <th>ค่าขนส่ง(¥)</th>
            <th>รวม(฿)</th>
            <th>แจ้งชำระ</th>
            <th>สถานะ</th>
            <th>Noted</th>
            <th>Edit</th>
            <th></th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {!loading && (
            <>
              {" "}
              {orders.map((item, index) => {
                let t = item.link.split("/");
                let link = t[t.length - 1];
                return (
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
                      <img src={item.imgsrc} width={100} alt={item.imgsrc} />
                    </td>
                    <td className="align-middle">{item.username}</td>
                    <td className="align-middle">
                      <a href={item.link} target="_blank" rel="noreferrer">
                        {link}
                      </a>
                    </td>

                    <td className="align-middle">
                      <div>{item.bid} (¥)</div>
                      <div style={{ backgroundColor: "yellow" }}>
                        {item.bid_by}
                      </div>
                    </td>
                    <td className="align-middle">
                      {item.tranfer_fee_injapan === null ? (
                        "-"
                      ) : (
                        <>{item.tranfer_fee_injapan} (฿)</>
                      )}
                    </td>
                    <td className="align-middle">
                      {item.delivery_in_thai === null ? (
                        "-"
                      ) : (
                        <>{item.delivery_in_thai} (¥)</>
                      )}
                    </td>
                    <td className="align-middle">
                      {item.tranfer_fee_injapan === null &&
                      item.delivery_in_thai === null ? (
                        "ข้อมูลยังไม่ครบ"
                      ) : (
                        <>
                          {Math.round(
                            (item.bid + item.delivery_in_thai) * yen
                          ) + item.tranfer_fee_injapan}{" "}
                          (฿)
                        </>
                      )}
                    </td>
                    <td className="align-middle">
                      <input
                        type="checkbox"
                        checked={item.inform_bill}
                        onChange={() =>
                          handleCheckInformBill(item.inform_bill, item.id)
                        }
                      />
                    </td>
                    <td className="align-middle">
                      {item.payment_status === "pending1" && "รอค่าส่ง"}
                      {item.payment_status === "pending2" && "รอการชำระ"}
                      {item.payment_status === "pending3" && "รอการตรวจสอบ"}
                      {item.payment_status === "paid" &&
                        "ชำระเงินเรียบร้อยแล้ว"}
                    </td>
                    <td className="align-middle">
                      {item.noted !== null && item.noted !== ""
                        ? item.noted
                        : "-"}
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
                    <td className="align-middle">
                      <Button
                        onClick={() => handleAddNoted(item.id, item.noted)}
                      >
                        Noted
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </Table>
      {!loading2 && loading && <Loading load={1} />}
      {loading2 && <Loading />}
      <UpdateWin
        show={modalShow}
        onHide={() => setModalShow(false)}
        item={temp}
        trigger={trigger}
        setTrigger={setTrigger}
      />
      <NotedModal
        show={notedModal}
        onHide={() => setNotedModal(false)}
        item={tempNoted}
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

function UpdateWin(props) {
  const [item, setItem] = useState(props.item);
  const [slip, setSlip] = useState("");
  const [modalShowSlip, setModalShowSlip] = useState(false);
  const [modalShowUploadSlip, setModalShowUploadSlip] = React.useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setItem(props.item);
  }, [props.item]);
  const handleChangeItem = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };
  const handleUpdateWin = () => {
    setLoading(true);
    let win = {
      id: item.id,
      bid: item.bid,
      tranferFee: item.tranfer_fee_injapan,
      deliveryFee: item.delivery_in_thai,
      paymentStatus: item.payment_status,
    };
    // console.log(win);
    fetch("/api/admin/yahoo/order/win", {
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
          props.setTrigger(!props.trigger);
          props.onHide();
        } else {
          if (json.error === "jwt") {
            alert("Your Login Session Is Expired,\nPlease Sign In Again!");
            localStorage.removeItem("AdminToken");
          } else {
            alert(json.message);
          }
          window.location.reload(false);
        }
        setLoading(false);
      });
  };
  const handleShowSlip = (payment_id) => {
    fetch("/api/yahoo/payment/slip/" + payment_id, {
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
              {item.payment_status === "pending2" && (
                <Button
                  variant="primary"
                  onClick={() => setModalShowUploadSlip(true)}
                >
                  Upload Slip
                </Button>
              )}
              <ModalUploadSlip
                show={modalShowUploadSlip}
                onHide={() => setModalShowUploadSlip(false)}
                item={item}
              />
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
        trigger={props.trigger}
        setTrigger={props.setTrigger}
      />
      {loading && <Loading />}
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

function ModalUploadSlip(props) {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState();
  const [yen, setYen] = useState("");
  const [loading, setLoading] = useState(false);
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
  });
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
  };
  const handleUpload = () => {
    if (file === null) {
      alert(`please choose slip first!`);
    } else {
      setLoading(true);
      let sum =
        Math.round((props.item.bid + props.item.delivery_in_thai) * yen) +
        props.item.tranfer_fee_injapan;
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "d2u-service");
      data.append("cloud_name", "d2u-service");
      fetch("https://api.cloudinary.com/v1_1/d2u-service/upload", {
        method: "POST",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          fetch("/api/admin/yahoo/payment", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slip_image_filename: data.url,
              price: sum,
              order_id: props.item.id,
            }),
          })
            .then((res) => res.json())
            .then((data1) => {
              if (data1.status) {
                props.setTrigger(!props.trigger);
                setLoading(false);
              } else {
                alert(data1.message);
                window.location.reload(false);
              }
            });
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Upload Slip
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Slip</Form.Label>
          <Form.Control
            type="file"
            size="sm"
            name="pic1_filename"
            onChange={handleFileChange}
          />
        </Form.Group>
        {image !== "" && <img src={image} width={200} />}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpload}>Upload</Button>
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
