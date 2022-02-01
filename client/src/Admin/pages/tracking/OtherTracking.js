import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Table, Col } from "react-bootstrap";

export default function OtherTracking() {
  const [trackings, setTrackings] = useState([]);
  const [modalShowAdd, setModalShowAdd] = React.useState(false);
  const [modalShowUpdate, setModalShowUpdate] = React.useState(false);
  const [item, setItem] = useState({});
  useEffect(() => {
    fetch("/api/admin/tracking/123", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setTrackings(json.data);
      });
  }, []);
  const handleConfigs = (item) => {
    setItem(item);
    setModalShowUpdate(true);
  };
  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="bg-secondary p-2">123 Tracking</h3>
        <Button variant="primary" onClick={() => setModalShowAdd(true)}>
          Add Tracking
        </Button>
      </div>

      <AddTrackModal
        show={modalShowAdd}
        onHide={() => setModalShowAdd(false)}
      />
      <UpdateTrackModal
        show={modalShowUpdate}
        onHide={() => setModalShowUpdate(false)}
        item={item}
      />
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Channel</th>
            <th>Username</th>
            <th>Track Id</th>
            <th>weight</th>
            <th>Round Boat</th>
            <th>Pic1</th>
            <th>Pic2</th>
            <th>Remark</th>
            <th>config</th>
          </tr>
        </thead>
        <tbody>
          {trackings.map((item, index) => (
            <tr key={index}>
              <td className="align-middle">{index + 1}</td>
              <td className="align-middle">{item.date}</td>
              <td className="align-middle">{item.channel}</td>
              <td className="align-middle">{item.username}</td>
              <td className="align-middle">{item.track_id}</td>
              <td className="align-middle">{item.weight}</td>
              <td className="align-middle">{item.round_boat}</td>
              <td className="align-middle">
                <img
                  src={"/image/" + item.pic1_filename}
                  alt="image for pic1"
                  width={100}
                />
              </td>
              <td className="align-middle">
                <img
                  src={"/image/" + item.pic2_filename}
                  alt="image for pic2"
                  width={100}
                />
              </td>
              <td className="align-middle">{item.remark}</td>
              <td className="align-middle">
                <Button size="sm" onClick={() => handleConfigs(item)}>
                  Configs
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

function AddTrackModal(props) {
  const [tracking, setTracking] = useState(trackingModel);
  const [pic1File, setPic1File] = useState(null);
  const [pic2File, setPic2File] = useState(null);
  const [users, setUsers] = useState([]);
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
  });
  const handleChangeTracking = (e) => {
    setTracking({ ...tracking, [e.target.name]: e.target.value });
  };
  const handleSelectPic1File = (e) => {
    setPic1File(e.target.files[0]);
  };
  const handleSelectPic2File = (e) => {
    setPic2File(e.target.files[0]);
  };
  const handleUploadPic1File = () => {
    if (pic1File === null) {
      alert(`please choose slip first!`);
    } else {
      const fd = packFile(pic1File);
      fetch(`/api/upload`, {
        method: "POST",
        body: fd,
      })
        .then((res) => res.json())
        .then((result) => {
          alert("upload slip successfully");
          setTracking({
            ...tracking,
            pic1_filename: result.filename,
          });
        })
        .catch((err) => console.log(err));
    }
  };
  const handleUploadPic2File = () => {
    if (pic2File === null) {
      alert(`please choose slip first!`);
    } else {
      const fd = packFile(pic2File);
      fetch(`/api/upload`, {
        method: "POST",
        body: fd,
      })
        .then((res) => res.json())
        .then((result) => {
          alert("upload slip successfully");
          setTracking({
            ...tracking,
            pic2_filename: result.filename,
          });
        })
        .catch((err) => console.log(err));
    }
  };
  const handleAddTracking = () => {
    console.log(tracking);
    fetch("/api/admin/tracking/123", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tracking),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          alert(json.message);
          props.onHide();
          window.location.reload(false);
        } else {
          alert(json.message);
        }
      });
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
          123 Add Tracking
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col lg={6} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChangeTracking}
                  name="date"
                />
              </Form.Group>
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Select onChange={handleChangeTracking} name="username">
                  <option selected>Select</option>
                  {users.map((item, index) => (
                    <option key={index} value={item.username}>
                      {item.username}
                    </option>
                  ))}
                </Form.Select>
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
                <Form.Label>Round Boat</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChangeTracking}
                  name="round_boat"
                />
              </Form.Group>
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              <Form.Group controlId="formFileSm">
                <Form.Label>
                  Pic 1
                  <Button
                    onClick={handleUploadPic1File}
                    size="sm"
                    className="ms-3"
                  >
                    upload
                  </Button>
                </Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  onChange={handleSelectPic1File}
                  name="pic1_filename"
                />
              </Form.Group>
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              <Form.Group controlId="formFileSm">
                <Form.Label>
                  Pic 2
                  <Button
                    onClick={handleUploadPic2File}
                    size="sm"
                    className="ms-3"
                  >
                    upload
                  </Button>
                </Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  onChange={handleSelectPic2File}
                  name="pic2_filename"
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
    </Modal>
  );
}
function UpdateTrackModal(props) {
  const [tracking, setTracking] = useState({ ...props.item });
  const [pic1File, setPic1File] = useState(null);
  const [pic2File, setPic2File] = useState(null);
  const [users, setUsers] = useState([]);
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
  const handleSelectPic1File = (e) => {
    setPic1File(e.target.files[0]);
  };
  const handleSelectPic2File = (e) => {
    setPic2File(e.target.files[0]);
  };
  const handleUploadPic1File = () => {
    if (pic1File === null) {
      alert(`please choose slip first!`);
    } else {
      const fd = packFile(pic1File);
      fetch(`/api/upload`, {
        method: "POST",
        body: fd,
      })
        .then((res) => res.json())
        .then((result) => {
          alert("upload slip successfully");
          setTracking({
            ...tracking,
            pic1_filename: result.filename,
          });
        })
        .catch((err) => console.log(err));
    }
  };
  const handleUploadPic2File = () => {
    if (pic2File === null) {
      alert(`please choose slip first!`);
    } else {
      const fd = packFile(pic2File);
      fetch(`/api/upload`, {
        method: "POST",
        body: fd,
      })
        .then((res) => res.json())
        .then((result) => {
          alert("upload slip successfully");
          setTracking({
            ...tracking,
            pic2_filename: result.filename,
          });
        })
        .catch((err) => console.log(err));
    }
  };
  const handleUpdateTracking = () => {
    console.log(tracking);
    fetch("/api/admin/tracking", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tracking),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          alert(json.message);
          props.onHide();
          window.location.reload(false);
        } else {
          alert(json.message);
        }
      });
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
            name="channel"
          >
            <option value={"yahoo"} selected={tracking.channel === "yahoo"}>
              Yahoo
            </option>
            <option value={"mercari"} selected={tracking.channel === "mercari"}>
              Mercari
            </option>
            <option value={"123"} selected={tracking.channel === "123"}>
              123
            </option>
          </Form.Select>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col lg={6} sm={12} className="mb-3">
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
            <Col lg={6} sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Select onChange={handleChangeTracking} name="username">
                  {tracking.username === "" ? (
                    <option selected>Select</option>
                  ) : (
                    <option value={tracking.username} selected>
                      {tracking.username}
                    </option>
                  )}
                  {users.map((item, index) => (
                    <option key={index} value={item.username}>
                      {item.username}
                    </option>
                  ))}
                </Form.Select>
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
                <Form.Label>Round Boat</Form.Label>
                <Form.Control
                  type="date"
                  onChange={handleChangeTracking}
                  name="round_boat"
                  value={tracking.round_boat}
                />
              </Form.Group>
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              <Form.Group controlId="formFileSm">
                <Form.Label>
                  Pic 1
                  <Button
                    onClick={handleUploadPic1File}
                    size="sm"
                    className="ms-3"
                  >
                    upload
                  </Button>
                </Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  onChange={handleSelectPic1File}
                  name="pic1_filename"
                />
              </Form.Group>
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              <Form.Group controlId="formFileSm">
                <Form.Label>
                  Pic 2
                  <Button
                    onClick={handleUploadPic2File}
                    size="sm"
                    className="ms-3"
                  >
                    upload
                  </Button>
                </Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  onChange={handleSelectPic2File}
                  name="pic2_filename"
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
};
function packFile(file) {
  const fd = new FormData();
  fd.append("image", file, file.name);
  return fd;
}
