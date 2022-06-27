import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";

export default function LoginAdmin() {
  const [account, setAccount] = useState({
    username: "",
    password: "",
    mode: 1,
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
          // alert(json.message);
          console.log(json);
          localStorage.setItem("AdminToken", json.token);
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
        <h3 style={style.topicSecondary}>Login(Admin)</h3>
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
      </Form>
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
