import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function NavBarUser() {
  const history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(false);
  };
  return (
    <Navbar
      bg="dark"
      expand="lg"
      variant="dark"
      style={{ marginBottom: "30px" }}
    >
      <Container fluid>
        <Navbar.Brand href="#">D2U SERVICES</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {navLink.map((item, i) => (
              <Nav.Link key={i + 1} onClick={() => history.push(item.path)}>
                {item.name}
              </Nav.Link>
            ))}
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
const navLink = [
  { name: "Home", path: "/" },
  { name: "Auction", path: "/auction" },
  { name: "Tracking", path: "/tracking" },
];
