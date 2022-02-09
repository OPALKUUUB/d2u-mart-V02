import React, { useState, useEffect } from "react";
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
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [yen, setYen] = useState("");
  const [orders, setOrders] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [temp, setTemp] = useState({});

  useEffect(async () => {
    await fetch("/api/yen", {
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
    await fetch("/api/admin/yahoo/history", {
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
  const handleEdit = (item) => {
    setTemp(item);
    setModalShow(true);
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

    return (
      <>
        {t.map((item, index) => (
          <tr key={index}>
            <td className="align-middle">{index + 1}</td>
            <td className="align-middle">
              {item.created_at === null || item.created_at === "" ? (
                ""
              ) : (
                <>
                  {parseInt(item.created_at.split("T")[0].split("-")[2])}{" "}
                  {month[parseInt(item.created_at.split("T")[0].split("-")[1])]}{" "}
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
              <br />
              {item.bid === null || item.bid === "" ? "-" : item.bid} (¥)/
              {item.tranfer_fee_injapan === null ||
              item.tranfer_fee_injapan === ""
                ? "-"
                : item.tranfer_fee_injapan}{" "}
              (฿)/
              {item.delivery_in_thai === null || item.delivery_in_thai === ""
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
      <h3 className="mb-3">Yahoo History Table</h3>
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
          {date === "" && username !== "" && auctionFilter(1)}
          {date !== "" && username === "" && auctionFilter(2)}
          {date !== "" && username !== "" && auctionFilter(3)}
          {date === "" && username === "" && auctionFilter(4)}
        </tbody>
      </Table>
      <EditYahooHistory
        show={modalShow}
        onHide={() => setModalShow(false)}
        item={temp}
      />
    </>
  );
}

function EditYahooHistory(props) {
  const [order, setOrder] = useState(props.item);
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
          alert(json.message);
          window.location.reload(false);
        } else {
          alert(json.message);
        }
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
