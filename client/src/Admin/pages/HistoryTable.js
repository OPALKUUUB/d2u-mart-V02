import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import {
  Button,
  Container,
  Form,
  Modal,
  Row,
  Table,
  Col,
} from "react-bootstrap";

export default function HistoryTable() {
  const [yen, setYen] = useState("");
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [trackId, setTrackId] = useState("");
  const [orderBy, setOrderBy] = useState("DESC1");
  const [roundBoat, setRoundBoat] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [temp, setTemp] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [trackLength, setTrackLength] = useState();
  let page = 50;
  useEffect(() => {
    const FetchYen = async () => {
      const json = await fetch("/api/yen").then((res) => res.json());
      if (json.status) {
        setYen(json.yen);
      } else {
        alert(json.message);
      }
    };
    FetchYen();
  }, [yen]);

  useEffect(() => {
    const FetchOrders = async () => {
      const result = await fetch(
        `/api/admin/yahoo/history?status=${status}&username=${username}&date=${date}&trackId=${trackId}&orderBy=${orderBy}&roundBoat=${roundBoat}`
      ).then((res) => res.json());
      if (result.status) {
        let len_tracking = result.data.length;
        setTrackLength(len_tracking);
        console.log(result.data);
        let temp = [];
        let start = currentPage * page;
        for (let i = start; i < page * (currentPage + 1); i++) {
          if (i >= len_tracking) {
            break;
          }
          temp.push(result.data[i]);
        }
        setOrders(temp);
      } else {
        alert("fetch fail from history yahoo!");
      }
      setLoading(false);
      setLoading2(false);
    };
    setLoading(true);
    FetchOrders();
  }, [
    currentPage,
    status,
    username,
    date,
    orderBy,
    trackId,
    roundBoat,
    trigger,
  ]);

  const handleEdit = (item) => {
    setTemp(item);
    setModalShow(true);
  };

  const handlePrevious = () => {
    if (currentPage === 0) {
      alert("This is a first page!");
    } else {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if ((currentPage + 1) * 10 >= trackLength) {
      alert("This is a last page!");
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <h3 className="mb-3">Yahoo History Table</h3>
      <Row>
        <Col sm={12} md={4} lg={2}>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
          </Form.Group>
        </Col>
        <Col sm={12} md={4} lg={2}>
          <Form.Group className="mb-3">
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
        <Col sm={12} md={4} lg={2}>
          <Form.Group className="mb-3">
            <Form.Label>Track Id</Form.Label>
            <Form.Control
              type="text"
              name="track_id"
              onChange={(e) => setTrackId(e.target.value)}
              placeholder="Enter Track Id"
              value={trackId}
            />
          </Form.Group>
        </Col>
        <Col sm={12} md={4} lg={2}>
          <Form.Group className="mb-3">
            <Form.Label>เรียงวันที่</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => {
                setLoading(true);
                setOrderBy(e.target.value);
              }}
              value={orderBy}
            >
              <option value="DESC1">ใหม่ไปเก่า</option>
              <option value="ASC1">เก่าไปใหม่</option>
              <option value="ASC2">รอบเรือเก่าไปใหม่</option>
              <option value="DESC2">รอบเรือใหม่ไปเก่า</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={12} md={4} lg={2}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>รอบเรือ&nbsp;</Form.Label>
            <Form.Control
              type="date"
              name="roundBoat"
              onChange={(e) => setRoundBoat(e.target.value)}
              value={roundBoat}
            />
          </Form.Group>
        </Col>
        <Col sm={12} md={4} lg={2}>
          <Form.Group className="mb-3">
            <Form.Label>สถานะ</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => setStatus(e.target.value)}
              value={status}
            >
              <option value="all">all</option>
              <option value="win">win</option>
              <option value="lose">lose</option>
            </Form.Select>
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
            <th>Status</th>
            <th>Detail (bid/tranfer/deli.)</th>
            <th>Track id</th>
            <th>หมายเลขกล่อง</th>
            <th>น้ำหนัก(kg.)</th>
            <th>รอบเรือ</th>
            <th>Edit Tracking</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {orders.map((item, index) => (
            <tr key={index}>
              <td className="align-middle">{index + 1 + currentPage * page}</td>
              <td className="align-middle">
                {item.created_at === null || item.created_at === "" ? (
                  ""
                ) : (
                  <>
                    {parseInt(item.created_at.split("T")[0].split("-")[2])}{" "}
                    {
                      month[
                        parseInt(item.created_at.split("T")[0].split("-")[1])
                      ]
                    }{" "}
                    {parseInt(item.created_at.split("T")[0].split("-")[0])}
                  </>
                )}
              </td>
              <td className="align-middle">
                <img src={item.imgsrc} width={100} />
              </td>
              <td className="align-middle">{item.username}</td>
              <td className="align-middle">{item.status}</td>
              <td className="align-middle">
                {item.link === null || item.link === "" ? (
                  ""
                ) : (
                  <>
                    <a href={item.link} target="_blank">
                      {item.link.split("/")[5]}
                    </a>
                  </>
                )}
                <span
                  style={{
                    backgroundColor: "yellow",
                    width: "fit-content",
                    marginLeft: "10px",
                  }}
                >
                  ({item.bid_by})
                </span>
                {item.status === "win" && (
                  <>
                    <br />
                    {item.bid === null || item.bid === "" ? "-" : item.bid} (¥)/
                    {item.tranfer_fee_injapan === null ||
                    item.tranfer_fee_injapan === ""
                      ? "-"
                      : item.tranfer_fee_injapan}{" "}
                    (฿)/
                    {item.delivery_in_thai === null ||
                    item.delivery_in_thai === ""
                      ? "-"
                      : item.delivery_in_thai}{" "}
                    (¥)
                    <br />
                    sum:{" "}
                    {item.bid === null ||
                    item.bid === "" ||
                    item.tranfer_fee_injapan === null ||
                    item.tranfer_fee_injapan === "" ||
                    item.delivery_in_thai === null ||
                    item.delivery_in_thai === "" ? (
                      ""
                    ) : (
                      <>
                        {Math.round((item.bid + item.delivery_in_thai) * yen) +
                          item.tranfer_fee_injapan}{" "}
                      </>
                    )}
                    (฿)
                  </>
                )}
              </td>
              <td className="align-middle">{item.track_id}</td>
              <td className="align-middle">{item.box_id}</td>
              <td className="align-middle">{item.weight}</td>
              <td className="align-middle">
                {item.round_boat === null || item.round_boat === "" ? (
                  ""
                ) : (
                  <>
                    {parseInt(item.round_boat.split("-")[2])}{" "}
                    {month[parseInt(item.round_boat.split("-")[1])]}
                  </>
                )}
                {/* {parseInt(item.round_boat.split("-")[2])}{" "}
              {month[parseInt(item.round_boat.split("-")[1])]} */}
              </td>
              <td className="align-middle">
                <Button variant="primary" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {!loading2 && loading && <Loading load={1} />}
      {loading2 && <Loading />}
      <Row className="mb-3">
        <Col>
          <Button onClick={handlePrevious}>Previous</Button>
        </Col>
        <Col className="d-flex justify-content-center">
          <h5>Amount {trackLength} item</h5>
        </Col>
        <Col className="d-flex justify-content-end">
          <Button onClick={handleNext}>Next</Button>
        </Col>
      </Row>

      <EditYahooHistory
        show={modalShow}
        onHide={() => setModalShow(false)}
        item={temp}
        trigger={trigger}
        setTrigger={setTrigger}
      />
    </>
  );
}
function EditYahooHistory(props) {
  const [order, setOrder] = useState(props.item);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setOrder(props.item);
  }, [props]);
  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };
  let template = [
    {
      label: "Track id",
      type: "text",
      name: "track_id",
      change: handleChange,
      placeholder: "Enter Track Id",
      value: order.track_id,
    },
    {
      label: "หมายเลขกล่อง",
      type: "text",
      name: "box_id",
      change: handleChange,
      placeholder: "Enter Box Id",
      value: order.box_id,
    },
    {
      label: "น้ำหนัก(kg.)",
      type: "number",
      name: "weight",
      change: handleChange,
      placeholder: "Enter weight(kg.)",
      value: order.weight,
    },
    {
      label: "รอบเรือ	",
      type: "date",
      name: "round_boat",
      change: handleChange,
      placeholder: "",
      value: order.round_boat,
    },
  ];
  const handleSubmit = () => {
    setLoading(true);
    fetch("/api/admin/yahoo/tracking", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          props.setTrigger(!props.trigger);
          props.onHide();
        } else {
          alert(json.message);
        }
        setLoading(false);
      });
  };
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Yahoo Tracking
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <Row>
            {template.map((item, index) => (
              <Form.Group key={index} className="mb-3" controlId={item.name}>
                <Form.Label>{item.label}</Form.Label>
                <Form.Control
                  type={item.type}
                  name={item.name}
                  onChange={item.change}
                  placeholder={item.placeholder}
                  value={item.value}
                />
              </Form.Group>
            ))}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Save</Button>
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
