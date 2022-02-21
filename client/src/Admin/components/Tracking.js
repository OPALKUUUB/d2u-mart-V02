import React, { useState, useEffect } from "react";
import { Button, Form, Row, Table, Col } from "react-bootstrap";
import AddTrackingModal from "./AddTrackingModal";

import Loading from "./Loading";
import ShowImage from "./ShowImage";
import UpdateTrackingModal from "./UpdateTrackingModal";

export default function Tracking(props) {
  const [trackings, setTrackings] = useState([]);
  const [modalShowAdd, setModalShowAdd] = React.useState(false);
  const [modalShowUpdate, setModalShowUpdate] = React.useState(false);
  const [item, setItem] = useState({});
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [trackId, setTrackId] = useState("");
  const [orderBy, setOrderBy] = useState("ASC1");
  const [roundBoat, setRoundBoat] = useState("");
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [modalShowImage, setModalShowImage] = useState(false);
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    const fetchTrack = async () => {
      const result = await fetch(
        `/api/admin/track/${props.mode}?username=${username}&trackId=${trackId}&date=${date}&orderBy=${orderBy}&roundBoat=${roundBoat}`
      ).then((res) => res.json());
      if (result.status) {
        setTrackings(result.data);
        setLoading(false);
      } else {
        alert("fetch fail from tracking " + props.mode + "!");
        window.location.reload(false);
      }
    };
    fetchTrack();
  }, [username, trackId, date, orderBy, roundBoat, trigger]);
  const handleConfigs = (item) => {
    setItem(item);
    setModalShowUpdate(true);
  };

  const handleDelete = (id, index) => {
    if (window.confirm("คุณต้องการที่จะลบข้อมูลที่ " + index + "?")) {
      setLoading(true);
      fetch("/api/admin/tracking", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
        });
    }
  };

  const handleCheck1 = (check, id) => {
    setLoading(true);
    fetch("/api/admin/check1/tracking", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, check: !check }),
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

  const handleCheck2 = (check, id) => {
    setLoading(true);
    fetch("/api/admin/check2/tracking", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, check: !check }),
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

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="bg-warning p-2">{props.header} Tracking</h3>
        <Button variant="primary" onClick={() => setModalShowAdd(true)}>
          Add Tracking
        </Button>
      </div>
      <Row>
        <Col md>
          <Form.Group className="mb-3">
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
        <Col md>
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
        <Col md>
          <Form.Group className="mb-3">
            <Form.Label>Track Id</Form.Label>
            <Form.Control
              ttype="text"
              name="track_id"
              onChange={(e) => setTrackId(e.target.value)}
              placeholder="Enter Track Id"
              value={trackId}
            />
          </Form.Group>
        </Col>
        <Col md>
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
              <option value="ASC1">เก่าไปใหม่</option>
              <option value="DESC1">ใหม่ไปเก่า</option>
              <option value="ASC2">รอบเรือเก่าไปใหม่</option>
              <option value="DESC2">รอบเรือใหม่ไปเก่า</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md>
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
      </Row>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Username</th>
            <th>URL</th>
            <th>Track Id</th>
            <th>Box no.</th>
            <th>น้ำหนัก</th>
            <th>รอบเรือ</th>
            <th>รูป 1</th>
            <th>รูป 2</th>
            <th>ตรวจสอบ</th>
            <th>สถานะ</th>
            <th>Noted</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {trackings.map((item, index) => (
            <tr key={index}>
              <td className="align-middle">{index + 1}</td>
              <td className="align-middle">
                {parseInt(item.date.split("-")[2])}{" "}
                {month[parseInt(item.date.split("-")[1])]}{" "}
                {parseInt(item.date.split("-")[0])}
              </td>
              <td className="align-middle">{item.username}</td>
              <td className="align-middle">
                <a href={item.url} target="_blank">
                  link
                </a>
              </td>
              <td className="align-middle">
                {item.track_id === null ? "-" : <>{item.track_id}</>}
              </td>
              <td className="align-middle">
                {item.box_id === null ? "-" : <>{item.box_id}</>}
              </td>
              <td className="align-middle">
                {item.weight === null || item.weight === "" ? (
                  "-"
                ) : (
                  <>{item.weight} (Kg.)</>
                )}
              </td>
              <td className="align-middle">
                {parseInt(item.round_boat.split("-")[2])}{" "}
                {month[parseInt(item.round_boat.split("-")[1])]}
              </td>
              <td className="align-middle">
                {item.pic1_filename !== null && item.pic1_filename !== "" ? (
                  <img
                    onClick={() => {
                      setImage(item.pic1_filename);
                      setModalShowImage(true);
                    }}
                    src={item.pic1_filename}
                    alt="image for pic1"
                    width={100}
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="align-middle">
                {item.pic2_filename !== null && item.pic2_filename !== "" ? (
                  <img
                    onClick={() => {
                      setImage(item.pic2_filename);
                      setModalShowImage(true);
                    }}
                    src={item.pic2_filename}
                    alt="image for pic2"
                    width={100}
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="align-middle text-center">
                <input
                  type="checkbox"
                  checked={item.check1}
                  onChange={() => handleCheck1(item.check1, item.id)}
                />
              </td>
              <td className="align-middle text-center">
                <input
                  type="checkbox"
                  checked={item.check2}
                  onChange={() => handleCheck2(item.check2, item.id)}
                />
              </td>
              <td className="align-middle" width={150}>
                {item.remark}
              </td>
              <td className="align-middle">
                <div style={{ display: "flex" }}>
                  <Button
                    size="sm"
                    onClick={() => handleConfigs(item)}
                    variant="success"
                  >
                    <i class="fas fa-pencil-alt"></i>
                  </Button>
                  &nbsp;
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(item.id, index + 1)}
                  >
                    <i class="fas fa-times"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          <ShowImage
            show={modalShowImage}
            onHide={() => setModalShowImage(false)}
            src={image}
          />
        </tbody>
      </Table>
      <AddTrackingModal
        show={modalShowAdd}
        onHide={() => setModalShowAdd(false)}
        mode={props.mode}
        header={props.header}
      />
      <UpdateTrackingModal
        show={modalShowUpdate}
        onHide={() => setModalShowUpdate(false)}
        item={item}
        mode={props.mode}
        header={props.header}
      />
      {loading && <Loading />}
    </>
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
