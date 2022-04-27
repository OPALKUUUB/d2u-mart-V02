import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, FloatingLabel } from "react-bootstrap";

export default function Profile() {
  const [register, setRegister] = useState({});
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  useEffect(() => {
    fetch("/check/session", {
      headers: { token: localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.status) {
          alert(json.message);
          localStorage.removeItem("token");
          window.location.reload(false);
        }
      });
  }, []);
  useEffect(() => {
    fetch("/api/user/customer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setRegister(json.data);
        } else {
          alert(json.message);
          localStorage.removeItem("token");
          window.location.reload(false);
        }
      });
  }, []);
  const handleChange = (e) => {
    if (e.target.name === "address_case") {
      setRegister({
        ...register,
        address: "",
        [e.target.name]: e.target.value,
      });
    } else {
      setRegister({ ...register, [e.target.name]: e.target.value });
    }
  };
  const handleUpdate = () => {
    let regist = {};
    let check = true;
    if (p1 !== "" && p2 !== "" && p3 !== "") {
      if (p1 === register.password && p2 === p3) {
        regist = { ...register, password: p3 };
      } else {
        check = false;
      }
    } else {
      regist = register;
    }
    if (check) {
      fetch("/api/user/customer", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(regist),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status) {
            alert("Update Profile Successfull");
          } else {
            alert(json.message);
            localStorage.removeItem("token");
            window.location.reload(false);
          }
        });
    } else {
      alert("Please check password field again!");
    }
  };
  return (
    <div>
      <h1>Profile ({register.username})</h1>
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
              value={register.name}
            />
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
              value={register.phone}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            Password
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password1"
              onChange={(e) => setP1(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            New Password
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password2"
              onChange={(e) => setP2(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Form.Label column sm={2}>
            Confirm Password
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password3"
              onChange={(e) => setP3(e.target.value)}
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
                    name="address_case"
                    value="มารับเอง"
                    checked={register.address_case === "มารับเอง"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    label="ขนส่งในประเทศ"
                    name="address_case"
                    value="ขนส่งในประเทศ"
                    checked={register.address_case === "ขนส่งในประเทศ"}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
            </fieldset>
          </Col>
          <Col lg="9">
            {register.address_case === "มารับเอง" && (
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
            {register.address_case === "ขนส่งในประเทศ" && (
              <>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                  <Form.Label>
                    กรณีขนส่งในประเทศ โปรดใส่ข้อมูลการจัดส่ง
                  </Form.Label>
                  <FloatingLabel controlId="floatingTextarea2" label="Address">
                    <Form.Control
                      as="textarea"
                      placeholder="Leave a comment here"
                      style={{ height: "70px" }}
                      onChange={handleChange}
                      name="address"
                      value={register.address}
                    />
                  </FloatingLabel>
                </Form.Group>
              </>
            )}
          </Col>
        </Row>
      </Form>
      <Button onClick={handleUpdate}>Save</Button>
    </div>
  );
}
