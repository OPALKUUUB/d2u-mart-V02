import React, { useState, useEffect } from "react";
import { Button, Form, Row, Table, Col } from "react-bootstrap";
import AddTrackingModal from "./AddTrackingModal";

import Loading from "./Loading";
import UpdateTrackingModal from "./UpdateTrackingModal";

export default function Tracking(props) {
  const [trackings, setTrackings] = useState([]);
  const [modalShowAdd, setModalShowAdd] = React.useState(false);
  const [modalShowUpdate, setModalShowUpdate] = React.useState(false);
  const [item, setItem] = useState({});
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [trackId, setTrackId] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/admin/tracking/" + props.mode, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setTrackings(json.data);
          setLoading(false);
        } else {
          alert(json.message);
        }
      });
  }, []);
  const handleConfigs = (item) => {
    setItem(item);
    setModalShowUpdate(true);
  };
  const trackingFilter = () => {
    let temp = trackings;
    if (username !== "") {
      temp = temp.filter((u) => {
        let regex = new RegExp("(" + username + ")", "gi");
        let match = u.username.match(regex);
        if (match != null) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (trackId !== "") {
      temp = temp.filter((u) => {
        let regex = new RegExp("(" + trackId + ")", "gi");
        let match = u.track_id.match(regex);
        if (match != null) {
          return true;
        } else {
          return false;
        }
      });
    }
    if (date !== "") {
      temp = temp.filter((u) => {
        let regex = new RegExp("(" + date + ")", "gi");
        let fdate = formatDate(u.date);
        let match = fdate.match(regex);
        if (match != null) {
          return true;
        } else {
          return false;
        }
      });
    }
    const handleDelete = (id) => {
      fetch("/api/admin/tracking", {
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
        {temp.map((item, index) => (
          <tr key={index}>
            <td className="align-middle">{index + 1}</td>
            <td className="align-middle" style={{ minWidth: "100px" }}>
              {parseInt(item.date.split("-")[2])}{" "}
              {month[parseInt(item.date.split("-")[1])]}{" "}
              {parseInt(item.date.split("-")[0])}
            </td>
            <td className="align-middle">{item.channel}</td>
            <td className="align-middle">{item.username}</td>
            <td className="align-middle">
              <a href={item.url} target="_blank">
                link
              </a>
            </td>
            <td className="align-middle">{item.track_id}</td>
            <td className="align-middle">{item.box_id}</td>
            <td className="align-middle">{item.weight}</td>
            <td className="align-middle">
              {parseInt(item.round_boat.split("-")[2])}{" "}
              {month[parseInt(item.round_boat.split("-")[1])]}
            </td>
            <td className="align-middle">
              <img src={item.pic1_filename} alt="image for pic1" width={100} />
            </td>
            <td className="align-middle">
              <img src={item.pic2_filename} alt="image for pic2" width={100} />
            </td>
            <td className="align-middle" style={{ minWidth: "130px" }}>
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
                <Button variant="danger" onClick={() => handleDelete(item.id)}>
                  <i class="fas fa-times"></i>
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </>
    );
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
        <Col>
          <Form.Group className="mb-3">
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
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              ttype="text"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Track Id</Form.Label>
            <Form.Control
              ttype="text"
              name="track_id"
              onChange={(e) => setTrackId(e.target.value)}
              placeholder="Enter Track Id"
            />
          </Form.Group>
        </Col>
      </Row>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Channel</th>
            <th>Username</th>
            <th>URL</th>
            <th>Track Id</th>
            <th>หมายเลขกล่อง</th>
            <th>weight</th>
            <th>รอบเรือ</th>
            <th>Pic1</th>
            <th>Pic2</th>
            <th>Remark</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>{trackingFilter()}</tbody>
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
function formatDate(date) {
  let temp = date.split("-");
  let y = parseInt(temp[0]);
  let m = parseInt(temp[1]);
  let d = parseInt(temp[2]);
  return `${d}/${m}/${y}`;
}

let trackingModel = {
  date: "",
  username: "",
  track_id: "",
  weight: "",
  noted: "",
  round_boat: "",
  pic1_filename: "",
  pic2_filename: "",
  box_id: "",
};
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
function packFile(file) {
  const fd = new FormData();
  fd.append("image", file, file.name);
  return fd;
}
