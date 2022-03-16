import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Table, Col } from "react-bootstrap";
import AutoComplete from "../../components/AutoComplete";
import UploadCsv from "../../components/UploadCsv";
import Loading from "../../components/Loading";

export default function ShimizuTracking() {
  const [trackings, setTrackings] = useState([]);
  const [modalShowAdd, setModalShowAdd] = React.useState(false);
  const [modalShowAddCsv, setModalShowAddCsv] = React.useState(false);
  const [modalShowUpdate, setModalShowUpdate] = React.useState(false);
  const [item, setItem] = useState({});
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [trackId, setTrackId] = useState("");
  const [orderBy, setOrderBy] = useState("ASC1");
  const [roundBoat, setRoundBoat] = useState("");
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [trackLength, setTrackLength] = useState();
  let page = 50;
  useEffect(() => {
    const fetchTrack = async () => {
      const result = await fetch(
        `/api/admin/track/shimizu?username=${username}&trackId=${trackId}&date=${date}&orderBy=${orderBy}&roundBoat=${roundBoat}`
      ).then((res) => res.json());
      if (result.status) {
        let len_tracking = result.data.length;
        setTrackLength(len_tracking);
        let temp = [];
        let start = currentPage * page;
        for (let i = start; i < page * (currentPage + 1); i++) {
          if (i >= len_tracking) {
            break;
          }
          temp.push(result.data[i]);
        }
        setTrackings(temp);
      } else {
        alert("fetch fail from tracking shimizu!");
      }
      setLoading(false);
    };
    setLoading(true);
    fetchTrack();
  }, [username, trackId, date, orderBy, roundBoat, currentPage, trigger]);

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
          setTrigger(!trigger);
          if (!json.status) {
            alert(json.message);
          }
        });
    }
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
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="bg-success p-2">Shimizu Tracking</h3>
        <div>
          <Button variant="primary" onClick={() => setModalShowAdd(true)}>
            Add Tracking
          </Button>
          &nbsp;
          <Button variant="warning" onClick={() => setModalShowAddCsv(true)}>
            Upload CSV
          </Button>
        </div>
      </div>
      <Row>
        <Col lg={2}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Date&nbsp;</Form.Label>
            <Form.Control
              type="date"
              name="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
          </Form.Group>
        </Col>
        <Col lg={3}>
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
        <Col lg={3}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Track Id</Form.Label>
            <Form.Control
              type="text"
              name="trackId"
              onChange={(e) => setTrackId(e.target.value)}
              placeholder="Enter Track Id"
              value={trackId}
            />
          </Form.Group>
        </Col>
        <Col md lg={2}>
          <Form.Group className="mb-3">
            <Form.Label>เรียงวันที่</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => setOrderBy(e.target.value)}
              value={orderBy}
            >
              <option value="ASC1">เก่าไปใหม่</option>
              <option value="DESC1">ใหม่ไปเก่า</option>
              <option value="ASC2">รอบเรือเก่าไปใหม่</option>
              <option value="DESC2">รอบเรือใหม่ไปเก่า</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md lg={2}>
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
            <th>Channel</th>
            <th>Username</th>
            <th>Track Id</th>
            <th>หมายเลขกล่อง</th>
            <th>Weight(Kg.)</th>
            <th>รอบเรือ</th>
            <th>Remark</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {trackings.map((item, index) => (
            <tr key={index}>
              <td className="align-middle">{index + 1 + currentPage * page}</td>
              <td className="align-middle" style={{ minWidth: "100px" }}>
                {parseInt(item.date.split("-")[2])}{" "}
                {month[parseInt(item.date.split("-")[1])]}{" "}
                {parseInt(item.date.split("-")[0])}
              </td>
              <td className="align-middle">{item.channel}</td>
              <td className="align-middle">{item.username}</td>
              <td className="align-middle">{item.track_id}</td>
              <td className="align-middle">{item.box_id}</td>
              <td className="align-middle">{item.weight}</td>
              <td className="align-middle">
                {parseInt(item.round_boat.split("-")[2])}{" "}
                {month[parseInt(item.round_boat.split("-")[1])]}
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
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDelete(item.id, index + 1 + currentPage * page)
                    }
                  >
                    <i class="fas fa-times"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
      {loading && <Loading />}
      <AddTrackModal
        show={modalShowAdd}
        onHide={() => setModalShowAdd(false)}
        trigger={trigger}
        setTrigger={setTrigger}
      />
      <UpdateTrackModal
        show={modalShowUpdate}
        onHide={() => setModalShowUpdate(false)}
        item={item}
        trigger={trigger}
        setTrigger={setTrigger}
      />
      <UploadCsvModal
        show={modalShowAddCsv}
        onHide={() => setModalShowAddCsv(false)}
        item={item}
        trigger={trigger}
        setTrigger={setTrigger}
      />
    </>
  );
}

function AddTrackModal(props) {
  const [tracking, setTracking] = useState(trackingModel);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch("/api/admin/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setUsers(json.data);
        } else {
          alert(json.message);
        }
      });
  }, [props]);
  const handleChangeUsername = (data) => {
    if (data.length !== 0) {
      setTracking({ ...tracking, username: data[0].username });
    } else {
      setTracking({ ...tracking, username: "" });
    }
  };
  const handleChangeTracking = (e) => {
    setTracking({ ...tracking, [e.target.name]: e.target.value });
  };

  const handleAddTracking = async () => {
    if (tracking.username === "" || tracking.username === null) {
      alert("กรุณาเลือก username!");
    } else {
      setLoading(true);
      fetch("/api/admin/tracking/shimizu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tracking),
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
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledb
      sm={12}
      y="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Shimizu Add Tracking
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChangeTracking}
                  name="date"
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Username({tracking.username})</Form.Label>
                <AutoComplete
                  arr={users}
                  handleChange={handleChangeUsername}
                  label="username"
                  placeholder={"Select username"}
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>หมายเลขกล่อง</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChangeTracking}
                  name="box_id"
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Track Id</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChangeTracking}
                  name="track_id"
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Weight(kg.)</Form.Label>
                <Form.Control
                  type="number"
                  onChange={handleChangeTracking}
                  name="weight"
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>รอบเรือ</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChangeTracking}
                  name="round_boat"
                />
              </Form.Group>
            </Col>

            <Col lg={12} sm={12}>
              <Form.Group>
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChangeTracking}
                  name="remark"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleAddTracking}>Add</Button>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
      {loading && <Loading />}
    </Modal>
  );
}

function UpdateTrackModal(props) {
  const [tracking, setTracking] = useState({ ...props.item });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTracking({ ...props.item });
  }, [props]);
  useEffect(() => {
    fetch("/api/admin/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setUsers(json.data);
        } else {
          alert(json.message);
        }
      });
  }, []);
  const handleChangeTracking = (e) => {
    setTracking({ ...tracking, [e.target.name]: e.target.value });
  };

  const handleUpdateTracking = async () => {
    setLoading(true);
    let t = tracking;

    fetch("/api/admin/tracking", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(t),
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
  const handleChangeUsername = (data) => {
    if (data.length !== 0) {
      setTracking({ ...tracking, username: data[0].username });
    } else {
      setTracking({ ...tracking, username: "" });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledb
      sm={12}
      y="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Tracking
          <Form.Select
            size="sm"
            name="username"
            onChange={handleChangeTracking}
          >
            <option value={"shimizu"} selected={tracking.channel === "shimizu"}>
              Yahoo
            </option>
            <option value={"mercari"} selected={tracking.channel === "mercari"}>
              Mercari
            </option>
            <option value={"123"} selected={tracking.channel === "web123"}>
              123
            </option>
          </Form.Select>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChangeTracking}
                  name="date"
                  value={tracking.date}
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Username({tracking.username})</Form.Label>
                <AutoComplete
                  arr={users}
                  handleChange={handleChangeUsername}
                  label="username"
                  placeholder={"Select username"}
                  preset={tracking.username}
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>หมายเลขกล่อง</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChangeTracking}
                  name="box_id"
                  value={tracking.box_id}
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Track Id</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChangeTracking}
                  name="track_id"
                  value={tracking.track_id}
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Weight(kg.)</Form.Label>
                <Form.Control
                  type="number"
                  onChange={handleChangeTracking}
                  name="weight"
                  value={tracking.weight}
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>รอบเรือ</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChangeTracking}
                  name="round_boat"
                  value={tracking.round_boat}
                />
              </Form.Group>
            </Col>

            <Col lg={12} sm={12}>
              <Form.Group>
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChangeTracking}
                  name="remark"
                  value={tracking.remark}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpdateTracking}>Update</Button>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
      {loading && <Loading />}
    </Modal>
  );
}

function UploadCsvModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledb
      sm={12}
      y="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Upload CSV</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UploadCsv />
      </Modal.Body>
    </Modal>
  );
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
