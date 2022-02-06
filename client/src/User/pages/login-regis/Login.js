import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Modal,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";
import "./Login.css";

export default function Login() {
  const [modalShow, setModalShow] = React.useState(false);
  const [account, setAccount] = useState({
    username: "",
    password: "",
    mode: 2,
  });
  const handleChangeAccount = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };
  const handleSubmitAccount = async (e) => {
    e.preventDefault();
    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          alert(json.message);
          localStorage.setItem("token", json.token);
          window.location.reload(false);
        } else {
          alert(json.message);
        }
      });
  };
  return (
    <Container fluid="md" style={{ height: "100vh" }}>
      <h1 style={style.topicPrimary}>D2U SERVICES</h1>
      <Form style={style.box} onSubmit={handleSubmitAccount}>
        <h3 style={style.topicSecondary}>Login</h3>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Username"
            name="username"
            onChange={handleChangeAccount}
          />
          <Form.Text className="text-muted">
            We'll never share your account with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChangeAccount}
          />
        </Form.Group>
        <Button variant="primary" type="submit" style={{ width: "100%" }}>
          Submit
        </Button>
        <span className="Login-register-btn" onClick={() => setModalShow(true)}>
          register
        </span>
      </Form>
      <ModalRegister show={modalShow} onHide={() => setModalShow(false)} />
    </Container>
  );
}
const style = {
  box: {
    width: "350px",
    backgroundColor: "rgba(0,0,0,.04)",
    padding: "25px",
    borderRadius: "10px",
    margin: "0 auto",
  },
  topicPrimary: {
    textAlign: "center",
    fontWeight: "700",
    marginTop: "60px",
    marginBottom: "30px",
  },
  topicSecondary: {
    fontWeight: "700",
    marginBottom: "20px",
  },
};

function ModalRegister(props) {
  const [register, setRegister] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
    confirm_password: "",
    case: "มารับเอง",
    address: "",
  });
  const [alertUsername, setAlertUsername] = useState(false);
  const [alertPassword, setAlertPassword] = useState(false);
  const handleChange = (e) => {
    if (e.target.name === "case") {
      setRegister({
        ...register,
        address: "",
        [e.target.name]: e.target.value,
      });
    } else {
      setRegister({ ...register, [e.target.name]: e.target.value });
    }
    if (e.target.name === "username") {
      var re = new RegExp("^\\w[\\w.]{2,18}\\w$");
      if (e.target.value.match(re) === null) {
        setAlertUsername(true);
      } else {
        setAlertUsername(false);
      }
    }
    if (e.target.name === "password") {
      var re = new RegExp("^\\w[\\w.]{2,18}\\w$");
      if (e.target.value.match(re) === null) {
        setAlertPassword(true);
      } else {
        setAlertPassword(false);
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (IsNotEmpty(register) && alertUsername && alertPassword) {
      if (ConfirmPassword(register)) {
        fetch("/api/regist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(register),
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.status) {
              alert("Register is successfully");
              setRegister({
                name: "",
                username: "",
                phone: "",
                password: "",
                confirm_password: "",
                case: "มารับเอง",
                address: "",
              });
              props.onHide();
            } else {
              alert("Register is fail with Error: " + result.message);
            }
          })
          .catch((err) => console.log(err));
      } else {
        alert("In field confirm password is not match with password field!!!");
      }
    } else {
      alert("Please fill every input");
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
        <Modal.Title id="contained-modal-title-vcenter">Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              ชี่อ-นามสกุล
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                name="name"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              ชี่อผู้ใช้งาน
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                name="username"
                onChange={handleChange}
              />
              {alertUsername && (
                <Form.Text id="passwordHelpBlock" style={{ color: "red" }}>
                  Your username must be 4-18characters long, container only a-z,
                  A-Z, 0-9
                </Form.Text>
              )}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              เบอร์โทร
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="tel"
                placeholder="Enter Phone"
                name="phone"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formHorizontalPassword"
          >
            <Form.Label column sm={2}>
              Password
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={handleChange}
              />
              {alertPassword && (
                <Form.Text id="passwordHelpBlock" style={{ color: "red" }}>
                  Your password must be 4-18characters long, container only a-z,
                  A-Z, 0-9
                </Form.Text>
              )}
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formHorizontalPassword"
          >
            <Form.Label column sm={2}>
              Confirm Password
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="password"
                placeholder="Enter Confirm Password"
                name="confirm_password"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
          <Row className="justify-content-md-center">
            <Col sm>
              <fieldset>
                <Form.Group className="mb-3">
                  <Form.Label>วิธีที่ใช้ในการส่ง</Form.Label>
                  <Col>
                    <Form.Check
                      type="radio"
                      label="มารับเอง"
                      name="case"
                      id="formHorizontalRadios1"
                      value="มารับเอง"
                      checked={register.case === "มารับเอง"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="radio"
                      label="ขนส่งในประเทศ"
                      name="case"
                      id="formHorizontalRadios2"
                      value="ขนส่งในประเทศ"
                      checked={register.case === "ขนส่งในประเทศ"}
                      onChange={handleChange}
                    />
                  </Col>
                </Form.Group>
              </fieldset>
            </Col>
            <Col lg="9">
              {register.case === "มารับเอง" && (
                <>
                  <fieldset>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        กรณีที่มารับเอง สามารถเลือกสถานที่ได้ดังนี้
                      </Form.Label>
                      <Col>
                        <Form.Check
                          type="radio"
                          label="พระราม3 ซอย35 (พระราม3 แมนชั่น)"
                          value="พระราม3 ซอย35 (พระราม3 แมนชั่น)"
                          name="address"
                          onChange={handleChange}
                        />
                        <Form.Check
                          type="radio"
                          label="ถนนร่มเกล้า 19/1"
                          value="ถนนร่มเกล้า 19/1"
                          name="address"
                          onChange={handleChange}
                        />
                      </Col>
                    </Form.Group>
                  </fieldset>
                </>
              )}
              {register.case === "ขนส่งในประเทศ" && (
                <>
                  <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>
                      กรณีขนส่งในประเทศ โปรดใส่ข้อมูลการจัดส่ง
                    </Form.Label>
                    <FloatingLabel
                      controlId="floatingTextarea2"
                      label="Address"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        style={{ height: "70px" }}
                        onChange={handleChange}
                        name="address"
                      />
                    </FloatingLabel>
                  </Form.Group>
                </>
              )}
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Register</Button>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function IsNotEmpty(obj) {
  for (var key in obj) {
    if (obj[key] === "") return false;
  }
  return true;
}

function ConfirmPassword(item) {
  return item.password === item.confirm_password;
}
