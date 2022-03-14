import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AutoComplete from "./AutoComplete";
import Loading from "./Loading";

export default function UpdateTrackingModal(props) {
  const history = useHistory();
  const [tracking, setTracking] = useState(props.item);
  const [pic1File, setPic1File] = useState(null);
  const [pic2File, setPic2File] = useState(null);
  const [users, setUsers] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const FetchUser = async () => {
      const json = await fetch("/api/admin/users").then((res) => res.json());
      if (json.status) {
        setUsers(json.data);
      } else {
        alert(json.message);
        window.location.reload(false);
      }
    };
    FetchUser();
  }, []);
  useEffect(() => {
    setImage1(null);
    setImage2(null);
    let item = props.item;
    setTracking({
      channel: item.channel === null ? "" : item.channel,
      date: item.date === null ? "" : item.date,
      username: item.username === null ? "" : item.username,
      box_id: item.box_id === null ? "" : item.box_id,
      url: item.url === null ? "" : item.url,
      track_id: item.track_id === null ? "" : item.track_id,
      weight: item.weight === null ? "" : item.weight,
      round_boat: item.round_boat === null ? "" : item.round_boat,
      pic1_filename: item.pic1_filename === null ? "" : item.pic1_filename,
      pic2_filename: item.pic2_filename === null ? "" : item.pic2_filename,
      remark: item.remark === null ? "" : item.remark,
      id: item.id,
    });
  }, [props.item]);

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
    const PostPic = async (pic) => {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "d2u-service");
      data.append("cloud_name", "d2u-service");
      const urlname = await fetch(
        "https://api.cloudinary.com/v1_1/d2u-service/upload",
        {
          method: "POST",
          body: data,
        }
      )
        .then((resp) => resp.json())
        .then((data) => data.url)
        .catch((err) => console.log(err));
      return urlname;
    };
    const UpdateTracking = async (t) => {
      const json = await fetch("/api/admin/tracking", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(t),
      }).then((res) => res.json());
      if (json.status) {
        props.setTrigger(!props.trigger);
        props.onHide();
        setLoading(false);
      } else {
        alert(json.message);
      }
    };
    if (pic1File !== "" && pic1File !== null) {
      t.pic1_filename = PostPic(pic1File);
    }
    if (pic2File !== "" && pic2File !== null) {
      t.pic2_filename = PostPic(pic1File);
    }
    UpdateTracking(t);
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
          <Form.Select size="sm" onChange={handleChangeTracking} name="channel">
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
                  value={tracking.remark === null ? "" : tracking.remark}
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
