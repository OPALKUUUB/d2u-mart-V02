import React, { useState, useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import AutoComplete from "./AutoComplete";
import Loading from "./Loading";

export default function AddTrackingModal(props) {
  let date = new Date();
  let dfDate = date.toISOString().split("T")[0];
  let trackingModel = {
    date: dfDate,
    username: "",
    track_id: "",
    weight: "",
    noted: "",
    round_boat: "",
    pic1_filename: "",
    pic2_filename: "",
    box_id: "",
  };
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
  });

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

  const handleAddTracking = async () => {
    if (tracking.username === "" || tracking.username === null) {
      alert("กรุณาเลือก username!");
    } else {
      setLoading(true);
      let t = tracking;
      if (pic1File !== null) {
        const data = new FormData();
        data.append("file", pic1File);
        data.append("upload_preset", "d2u-service");
        data.append("cloud_name", "d2u-service");
        let urlname = await fetch(
          "https://api.cloudinary.com/v1_1/d2u-service/upload",
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
          "https://api.cloudinary.com/v1_1/d2u-service/upload",
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
      fetch("/api/admin/tracking/" + props.mode, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(t),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status) {
            setTracking(trackingModel);
            props.setTrigger(!props.trigger);
            props.onHide();
          } else {
            alert(json.message);
          }
          setLoading(false);
        });
    }
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
          {props.header} Add Tracking
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
                  value={dfDate}
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
