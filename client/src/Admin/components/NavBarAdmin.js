import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function NavBarAdmin() {
  const history = useHistory();
  const handleLogout = () => {
    localStorage.removeItem("AdminToken");
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
        <Navbar.Brand href="#">D2U SERVICES(admin)</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0">
            {navLink.map((item, i) => (
              <Nav.Link key={i + 1} onClick={() => history.push(item.path)}>
                {item.name}
              </Nav.Link>
            ))}
            <NavDropdown title="Tracking" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/admin/table/tracking/yahoo">
                Yahoo
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/table/tracking/mercari">
                Mercari
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/table/tracking/123">
                123
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

const navLink = [
  { name: "Auction", path: "/admin/table/yahoo/auction" },
  { name: "Payment", path: "/admin/table/yahoo/payment" },
  { name: "History", path: "/admin/table/yahoo/history" },
];
