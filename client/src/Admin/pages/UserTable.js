import React, { useState, useEffect } from "react";
import { Form, Table } from "react-bootstrap";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    fetch("/api/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("AdminToken"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setUsers(json.data);
        } else {
          alert(json.message);
          localStorage.removeItem("AdminToken");
          window.location.reload(false);
        }
      });
  }, []);

  return (
    <>
      <h3 className="mb-3">User Customer Table</h3>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Username</Form.Label>
        <Form.Control
          placeholder="Search Username"
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Table responsive="md" striped bordered hover size="sm">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Username</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {username === "" &&
            users.map((item, index) => (
              <tr key={index}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle">{item.created_at}</td>
                <td className="align-middle">{item.username}</td>
                <td className="align-middle">{item.name}</td>
                <td className="align-middle">{item.phone}</td>
                <td className="align-middle">{item.address}</td>
              </tr>
            ))}
          {username !== "" &&
            users
              .filter((u) => {
                let regex = new RegExp("(" + username + ")", "gi");
                let match = u.username.match(regex);
                if (match != null) {
                  return true;
                } else {
                  return false;
                }
              })
              .map((item, index) => (
                <tr key={index}>
                  <td className="align-middle">{index + 1}</td>
                  <td className="align-middle">{item.created_at}</td>
                  <td className="align-middle">{item.username}</td>
                  <td className="align-middle">{item.name}</td>
                  <td className="align-middle">{item.phone}</td>
                  <td className="align-middle">{item.address}</td>
                </tr>
              ))}
        </tbody>
      </Table>
    </>
  );
}
