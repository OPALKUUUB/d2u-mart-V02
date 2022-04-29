import React, { useState, useEffect } from "react";
import {
  Form,
  Table,
  Button,
  Modal,
  Row,
  Col,
  Dropdown,
  Container,
} from "react-bootstrap";
import Loading from "../components/Loading";
import ReactLoading from "react-loading";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [temp, setTemp] = useState({});
  const [pointManagementModalShow, setPointManagementModalShow] =
    useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const FetchUsers = async () => {
      const result = await fetch(
        `/api/admin/filter/users?username=${username}`,
        {
          headers: {
            token: localStorage.getItem("AdminToken"),
          },
        }
      ).then((res) => res.json());
      if (result.status) {
        setUsers(result.data);
        setLoading(false);
      } else {
        alert(result.message);
        window.localStorage.removeItem("AdminToken");
        window.location.reload(false);
      }
    };
    setLoading(true);
    FetchUsers();
  }, [username, trigger]);

  const handleShowPointManagementModal = (item) => {
    setTemp(item);
    setPointManagementModalShow(true);
  };

  const handleEditModal = (item) => {
    setTemp(item);
    setEditModalShow(true);
  };

  const handleCalP = () => {
    if (window.confirm("คุณใช่ opal รึไม่ ?")) {
      fetch("/cal/point");
      fetch("/cal/point/tracking");
      fetch("/cal/point/tracking/shimizu");
    }
  };

  const handleUpdatePoint = () => {
    // alert("ใช่ได้ในเดือนหน้า");
    if (window.confirm("คุณใช่ opal รึไม่ ?")) {
      fetch("/update/user/point", { method: "PATCH" });
      fetch("/update/user/point/tracking", { method: "PATCH" });
      fetch("/update/user/point/tracking/shimizu", { method: "PATCH" });
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-3">User Customer Table</h3>
        <div className="d-flex gap-1">
          <Button onClick={handleCalP}>Cal P.</Button>
          <Button onClick={handleUpdatePoint}>update point</Button>
        </div>
      </div>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Username</Form.Label>
        <Form.Control
          placeholder="Search Username"
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </Form.Group>
      <Table responsive="md" striped bordered hover size="sm">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>#</th>
            <th width={150}>Date</th>
            <th>Username</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Contact</th>
            <th>คะแนน</th>
            <th></th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {!loading && (
            <>
              {users.map((item, index) => (
                <tr key={index}>
                  <td className="align-middle">{index + 1}</td>
                  <td className="align-middle">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="align-middle">{item.username}</td>
                  <td className="align-middle">{item.name}</td>
                  <td className="align-middle">{item.phone}</td>
                  <td className="align-middle">{item.address}</td>
                  <td className="align-middle">
                    {item.contact === null ? "-" : item.contact}
                  </td>
                  <td className="align-middle">
                    {item.point_new === null || item.point_new === ""
                      ? "-"
                      : item.point_new}
                  </td>
                  <td className="align-middle">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="success"
                        id="dropdown-basic"
                        size="sm"
                      >
                        manage
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEditModal(item)}>
                          แก้ไข
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleShowPointManagementModal(item)}
                        >
                          คะแนน
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </Table>
      {loading && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ReactLoading
              type={"bubbles"}
              color={"rgba(0,0,0,0.2)"}
              height={400}
              width={300}
            />
          </div>
        </>
      )}
      {!loading && users.length === 0 && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "200px" }}
        >
          <h4>No Data Yet!</h4>
        </div>
      )}
      {/* test */}
      <PointManagementModal
        show={pointManagementModalShow}
        onHide={() => setPointManagementModalShow(false)}
        item={temp}
        setTrigger={setTrigger}
        trigger={trigger}
      />
      <EditUserModal
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        item={temp}
        setTrigger={setTrigger}
        trigger={trigger}
      />
    </>
  );
}

function EditUserModal(props) {
  const [user, setUser] = useState(props.item);

  useEffect(() => {
    setUser({
      username: props.item.username === null ? "" : props.item.username,
      name: props.item.name === null ? "" : props.item.name,
      phone: props.item.phone === null ? "" : props.item.phone,
      address: props.item.address === null ? "" : props.item.address,
      contact: props.item.contact === null ? "" : props.item.contact,
      id: props.item.id === null ? "" : props.item.id,
    });
  }, [props.item]);
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleUpdateUser = () => {
    const UpdateUser = async () => {
      const json = await fetch("/api/admin/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }).then((res) => res.json());
      if (json.status) {
        setUser({});
        props.setTrigger(!props.trigger);
        props.onHide();
      } else {
        alert(json.message);
      }
    };
    UpdateUser();
  };

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <Row>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  type="text"
                  value={user.username}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={user.name}
                  name="name"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  value={user.phone}
                  name="phone"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3" controlId="contact">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  value={user.contact}
                  name="contact"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col lg={12}>
              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={user.address}
                  name="address"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpdateUser} variant="success">
          Update
        </Button>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function PointManagementModal(props) {
  const [pointOld, setPointOld] = useState("");
  const [pointNew, setPointNew] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setPointOld(props.item.point_old);
    setPointNew(props.item.point_new);
    setLoading(false);
  }, [props]);

  const handleUpdate = () => {
    const FetchUpdatePoint = async () => {
      const result = await fetch("/api/admin/point", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          point_old: pointOld,
          point_new: pointNew,
          username: props.item.username,
        }),
      }).then((res) => res.json());
      if (result.status) {
        props.setTrigger(!props.trigger);
        setLoading(false);
        props.onHide();
      } else {
        alert(result.message);
      }
    };
    setLoading(true);
    FetchUpdatePoint();
  };
  const calBaseTranfer = (o, n) => {
    let tranferOld = calTranfer(o);
    let tranferNew = calTranfer(n);
    return n > o ? tranferNew : tranferOld;
  };

  const handleRef200 = (o, n) => {
    if (o !== null && n !== null && o !== "" && n !== "") {
      let pointUse = n > o ? n : o;
      if (pointUse <= 100) {
        return "เหมาขั้นต่ำ 1 kg.";
      } else if (pointUse > 100 && pointUse <= 500) {
        return "ไม่มีขั้นต่ำ";
      } else {
        return <></>;
      }
    } else {
      return "กรุณากรอกคะแนนปีที่แล้ว";
    }
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          จัดการคะแนนสะสม
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>ฐานค่าส่ง(฿)</Form.Label>
              <Form.Control
                type="number"
                value={calBaseTranfer(pointOld, pointNew)}
                className="mb-1"
              />
              <span className="text-muted">
                {handleRef200(pointOld, pointNew)}
              </span>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>คะแนนปีที่แล้ว</Form.Label>
              <Form.Control
                type="number"
                value={pointOld === null ? 0 : pointOld}
                onChange={(e) => setPointOld(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>คะแนนปัจจุบัน</Form.Label>
              <Form.Control
                type="number"
                value={pointNew === null ? 0 : pointNew}
                onChange={(e) => setPointNew(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleUpdate}>Update</Button>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
      {loading && <Loading />}
    </Modal>
  );
}

function calTranfer(point) {
  if (point === null || point === "") {
    return 0;
  }
  if (point <= 100) {
    return 200;
  } else if (point >= 101 && point <= 500) {
    return 200;
  } else if (point >= 501 && point <= 1000) {
    return 180;
  } else if (point >= 1001 && point <= 1500) {
    return 160;
  } else {
    return 150;
  }
}

function formatDate(raw_date) {
  let arr = raw_date.split("T");
  if (arr === 1) {
    return raw_date;
  }
  let f = arr[0].split("-");
  let t = arr[1].split(":");
  let h = parseInt(t[0]) + 7;

  return `${f[2]}/${f[1]}/${f[0]}\n${h}:${t[1]}`;
}
