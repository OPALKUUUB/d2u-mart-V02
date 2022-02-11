import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Table, Col } from "react-bootstrap";
import AutoComplete from "../../components/AutoComplete";

export default function FrilTracking() {
  const [trackings, setTrackings] = useState([]);
  const [modalShowAdd, setModalShowAdd] = React.useState(false);
  const [modalShowUpdate, setModalShowUpdate] = React.useState(false);
  const [item, setItem] = useState({});
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  useEffect(() => {
    fetch("/api/admin/tracking/fril", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setTrackings(json.data);
        } else {
          alert(json.message);
        }
      });
  }, []);
  const handleConfigs = (item) => {
    setItem(item);
    setModalShowUpdate(true);
  };
  const trackingFilter = (c) => {
    let temp = trackings;
    if (c === 1 || c === 3) {
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
    if (c === 2 || c === 3) {
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
  function formatDate(date) {
    let temp = date.split("-");
    let y = parseInt(temp[0]);
    let m = parseInt(temp[1]);
    let d = parseInt(temp[2]);
    return `${d}/${m}/${y}`;
  }
  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="bg-warning p-2">Fril Tracking</h3>
        <Button variant="primary" onClick={() => setModalShowAdd(true)}>
          Add Tracking
        </Button>
      </div>
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
        <tbody>
          {date === "" && username !== "" && trackingFilter(1)}
          {date !== "" && username === "" && trackingFilter(2)}
          {date !== "" && username !== "" && trackingFilter(3)}
          {date === "" && username === "" && trackingFilter(4)}
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
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  useEffect(() => {
    setImage1(null);
    setImage2(null);
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
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setImage1(objectUrl);
  };
  const handleSelectPic2File = (e) => {
    setPic2File(e.target.files[0]);
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setImage2(objectUrl);
  };
  const handlePaste1 = (e) => {
    if (e.clipboardData.files.length) {
      setPic1File(e.clipboardData.files[0]);
      const objectUrl = URL.createObjectURL(e.clipboardData.files[0]);
      setImage1(objectUrl);
    }
  };
  const handlePaste2 = (e) => {
    if (e.clipboardData.files.length) {
      setPic2File(e.clipboardData.files[0]);
      const objectUrl = URL.createObjectURL(e.clipboardData.files[0]);
      setImage2(objectUrl);
    }
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
    fetch("/api/admin/tracking/fril", {
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
          Fril Add Tracking
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
            <Col sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>URL</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChangeTracking}
                  name="url"
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
              <div
                style={{
                  cursor: "pointer",
                }}
                onPaste={handlePaste1}
              >
                {image1 === null ? (
                  <div
                    style={{
                      background: "gray",
                      width: "100%",
                      height: "150px",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    paste image hear
                  </div>
                ) : (
                  <img src={image1} width="100%" />
                )}
              </div>
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
              <div
                style={{
                  cursor: "pointer",
                }}
                onPaste={handlePaste2}
              >
                {image2 === null ? (
                  <div
                    style={{
                      background: "gray",
                      width: "100%",
                      height: "150px",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    paste image hear
                  </div>
                ) : (
                  <img src={image2} width="100%" />
                )}
              </div>
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
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  useEffect(() => {
    setImage1(null);
    setImage2(null);
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
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setImage1(objectUrl);
    console.log(image1);
  };
  const handleSelectPic2File = (e) => {
    setPic2File(e.target.files[0]);
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setImage2(objectUrl);
  };
  const handlePaste1 = (e) => {
    if (e.clipboardData.files.length) {
      setPic1File(e.clipboardData.files[0]);
      const objectUrl = URL.createObjectURL(e.clipboardData.files[0]);
      setImage1(objectUrl);
    }
  };
  const handlePaste2 = (e) => {
    if (e.clipboardData.files.length) {
      setPic2File(e.clipboardData.files[0]);
      const objectUrl = URL.createObjectURL(e.clipboardData.files[0]);
      setImage2(objectUrl);
    }
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
            name="channel"
          >
            <option value={"shimizu"} selected={tracking.channel === "shimizu"}>
              Yahoo
            </option>
            <option value={"mercari"} selected={tracking.channel === "mercari"}>
              Mercari
            </option>
            <option value={"fril"} selected={tracking.channel === "fril"}>
              Fril
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
            <Col sm={12} className="mb-3">
              <Form.Group>
                <Form.Label>URL</Form.Label>
                <Form.Control
                  type="text"
                  onChange={handleChangeTracking}
                  name="url"
                  value={tracking.url}
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
              <div
                style={{
                  cursor: "pointer",
                }}
                onPaste={handlePaste1}
              >
                {image1 === null ? (
                  <div
                    style={{
                      background: "gray",
                      width: "100%",
                      height: "150px",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    paste image hear
                  </div>
                ) : (
                  <img src={image1} width="100%" />
                )}
              </div>
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
              <div
                style={{
                  cursor: "pointer",
                }}
                onPaste={handlePaste2}
              >
                {image2 === null ? (
                  <div
                    style={{
                      background: "gray",
                      width: "100%",
                      height: "150px",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    paste image hear
                  </div>
                ) : (
                  <img src={image2} width="100%" />
                )}
              </div>
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
