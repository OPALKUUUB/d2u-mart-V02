import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, FloatingLabel } from "react-bootstrap";

export default function Profile() {
  const [register, setRegister] = useState({});
  useEffect(() => {
    fetch("/api/regist", {
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
    fetch("/api/regist", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify(register),
    })
      .then((res) => res.json())
      .then((json) => {
        alert(json.message);
      });
  };
  return (
    <div>
      <h1>Profile</h1>
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
            ตั้งชี่อผู้ใช้งาน
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              name="username"
              onChange={handleChange}
              value={register.username}
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
                    checked={register.address_case === "มารับเอง"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    type="radio"
                    label="ขนส่งในประเทศ"
                    name="case"
                    id="formHorizontalRadios2"
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
