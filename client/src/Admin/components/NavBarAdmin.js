import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Modal,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function NavBarAdmin() {
  const [modalShow, setModalShow] = useState(false);
  const [yen, setYen] = useState("");
  const history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem("AdminToken");
    window.location.reload(false);
  };
  useEffect(() => {
    fetch("/api/yen", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setYen(json.yen);
        } else {
          alert(json.message);
        }
      });
  }, [yen]);
  return (
    <Navbar
      bg="dark"
      expand="lg"
      variant="dark"
      style={{ marginBottom: "30px" }}
    >
      <Container fluid>
        <Navbar.Brand href="#">
          D2U SERVICES(admin)
          <Button size="sm" className="ms-3" onClick={() => setModalShow(true)}>
            1 yen: {yen} bath
          </Button>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0">
            <Nav.Link href="/admin/table/user">User</Nav.Link>
            <NavDropdown title="Yahoo" id="collasible-nav-dropdown">
              {navLink.map((item, i) => (
                <NavDropdown.Item key={i + 1} href={item.path}>
                  {item.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <NavDropdown title="Tracking" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/admin/table/tracking/shimizu">
                Shimizu
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/table/tracking/mercari">
                Mercari
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/table/tracking/fril">
                Fril
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/table/tracking/123">
                Web123
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <ChangeYen
        show={modalShow}
        onHide={() => setModalShow(false)}
        yen={yen}
      />
    </Navbar>
  );
}

const navLink = [
  { name: "Auction", path: "/admin/table/yahoo/auction" },
  { name: "Payment", path: "/admin/table/yahoo/payment" },
  { name: "History/Tracking", path: "/admin/table/yahoo/history" },
  { name: "Add", path: "/admin/yahoo/auction" },
];

function ChangeYen(props) {
  const [yen, setYen] = useState(props.yen);
  useEffect(() => {
    setYen(props.yen);
  }, [props]);
  const handleSubmit = () => {
    fetch("/api/yen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yen: yen }),
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
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Change Yen</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        1 yen : <input value={yen} onChange={(e) => setYen(e.target.value)} />{" "}
        bath
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Set</Button>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
