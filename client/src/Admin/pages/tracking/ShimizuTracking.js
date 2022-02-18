import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Table, Col } from "react-bootstrap";
import AutoComplete from "../../components/AutoComplete";
import ReactLoading from "react-loading";
import UploadCsv from "../../components/UploadCsv";
import Loading from "../../components/Loading";
import ShowImage from "../../components/ShowImage";

export default function ShimizuTracking() {
  const [trackings, setTrackings] = useState([]);
  const [modalShowAdd, setModalShowAdd] = React.useState(false);
  const [modalShowAddCsv, setModalShowAddCsv] = React.useState(false);
  const [modalShowUpdate, setModalShowUpdate] = React.useState(false);
  const [item, setItem] = useState({});
  const [date, setDate] = useState("");
  const [username, setUsername] = useState("");
  const [trackId, setTrackId] = useState("");
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [modalShowImage, setModalShowImage] = useState(false);
  useEffect(() => {
    fetch("/api/admin/tracking/shimizu", {
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
            <td className="align-middle">{item.track_id}</td>
            <td className="align-middle">{item.box_id}</td>
            <td className="align-middle">{item.weight}</td>
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
        <ShowImage
          show={modalShowImage}
          onHide={() => setModalShowImage(false)}
          src={image}
        />
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
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
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

      <AddTrackModal
        show={modalShowAdd}
        onHide={() => setModalShowAdd(false)}
        loading={setLoading}
      />
      <UpdateTrackModal
        show={modalShowUpdate}
        onHide={() => setModalShowUpdate(false)}
        item={item}
        loading={setLoading}
      />
      <UploadCsvModal
        show={modalShowAddCsv}
        onHide={() => setModalShowAddCsv(false)}
        item={item}
        loading={setLoading}
      />
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Channel</th>
            <th>Username</th>
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
      {loading && (
        <>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              background: "rgba(0,0,0,0.3)",
              width: "100vw",
              height: "100vh",
              zIndex: "9999",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <ReactLoading
                type={"bubbles"}
                color={"rgba(0,0,0,0.2)"}
                height={400}
                width={300}
              />
            </div>
          </div>
        </>
      )}
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
  const [loading, setLoading] = useState(false);
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
  const handleAddTracking = async () => {
    setLoading(true);
    let t = tracking;
    if (pic1File !== null) {
      const data = new FormData();
      data.append("file", pic1File);
      data.append("upload_preset", "d2u-service");
      data.append("cloud_name", "d2u-service");
      let urlname = await fetch(
        "  https://api.cloudinary.com/v1_1/d2u-service/upload",
        {
          method: "POST",
          body: data,
        }
      )
        .then((resp) => resp.json())
        .then((data) => data.url)
        .catch((err) => console.log(err));
      t.pic1_filename = urlname;
    }
    if (pic2File !== null) {
      const data = new FormData();
      data.append("file", pic2File);
      data.append("upload_preset", "d2u-service");
      data.append("cloud_name", "d2u-service");
      let urlname = await fetch(
        "  https://api.cloudinary.com/v1_1/d2u-service/upload",
        {
          method: "POST",
          body: data,
        }
      )
        .then((resp) => resp.json())
        .then((data) => data.url)
        .catch((err) => console.log(err));
      t.pic2_filename = urlname;
    }
    fetch("/api/admin/tracking/shimizu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(t),
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
        setLoading(false);
      });
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
            <Col lg={6} sm={12} className="mb-3">
              <Form.Group controlId="formFileSm">
                <Form.Label>Pic 1</Form.Label>
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
                <Form.Label>Pic 2</Form.Label>
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
      {loading && <Loading />}
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
  const [loading, setLoading] = useState(false);

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
  const handleUpdateTracking = async () => {
    setLoading(true);
    let t = tracking;
    if (pic1File !== null) {
      const data = new FormData();
      data.append("file", pic1File);
      data.append("upload_preset", "d2u-service");
      data.append("cloud_name", "d2u-service");
      let urlname = await fetch(
        "  https://api.cloudinary.com/v1_1/d2u-service/upload",
        {
          method: "POST",
          body: data,
        }
      )
        .then((resp) => resp.json())
        .then((data) => data.url)
        .catch((err) => console.log(err));
      t.pic1_filename = urlname;
    }
    if (pic2File !== null) {
      const data = new FormData();
      data.append("file", pic2File);
      data.append("upload_preset", "d2u-service");
      data.append("cloud_name", "d2u-service");
      let urlname = await fetch(
        "  https://api.cloudinary.com/v1_1/d2u-service/upload",
        {
          method: "POST",
          body: data,
        }
      )
        .then((resp) => resp.json())
        .then((data) => data.url)
        .catch((err) => console.log(err));
      t.pic2_filename = urlname;
    }
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
          alert(json.message);
          props.onHide();
          window.location.reload(false);
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
            name="channel"
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
            <Col lg={6} sm={12} className="mb-3">
              {tracking.pic1_filename !== null &&
              tracking.pic1_filename !== "" ? (
                <div style={{ position: "relative" }}>
                  <span
                    onClick={() =>
                      setTracking({ ...tracking, pic1_filename: "" })
                    }
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      padding: "10px",
                      fontWeight: "900",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </span>
                  <img
                    style={{ width: "100%" }}
                    src={tracking.pic1_filename}
                    alt={tracking.pic1_filename}
                  />
                </div>
              ) : (
                <>
                  <Form.Group controlId="formFileSm">
                    <Form.Label>Pic 1</Form.Label>
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
                </>
              )}
            </Col>
            <Col lg={6} sm={12} className="mb-3">
              {tracking.pic2_filename !== null &&
              tracking.pic2_filename !== "" ? (
                <div style={{ position: "relative" }}>
                  <span
                    onClick={() =>
                      setTracking({ ...tracking, pic2_filename: "" })
                    }
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      padding: "10px",
                      fontWeight: "900",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </span>
                  <img
                    style={{ width: "100%" }}
                    src={tracking.pic2_filename}
                    alt={tracking.pic2_filename}
                  />
                </div>
              ) : (
                <>
                  <Form.Group controlId="formFileSm">
                    <Form.Label>Pic 2</Form.Label>
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
                </>
              )}
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
