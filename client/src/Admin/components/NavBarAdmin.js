import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Modal,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";

export default function NavBarAdmin() {
  const [modalShow, setModalShow] = useState(false);
  const [yen, setYen] = useState("");
  const [annoucementModal, setAnnoucementModal] = React.useState(false);
  const handleLogout = () => {
    localStorage.removeItem("AdminToken");
    window.location.reload(false);
  };
  useEffect(() => {
    const FetchAnnoucement = async () => {
      const json = await fetch("/api/admin/annoucement", {
        method: "GET",
        headers: {
          token: localStorage.getItem("AdminToken"),
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      if (json.status) {
        if (json.annoucement) {
          setAnnoucementModal(true);
        } else {
          setAnnoucementModal(false);
        }
      } else {
        alert(json.message);
        if (json.error === "jwt") {
          localStorage.removeItem("AdminToken");
        }
        window.location.reload(false);
      }
    };
    FetchAnnoucement();
  }, []);
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
      <AnnoucementModal
        show={annoucementModal}
        onHide={() => setAnnoucementModal(false)}
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

function AnnoucementModal(props) {
  const handleClick = () => {
    const FetchAnnoucement = async () => {
      const json = await fetch("/api/admin/annoucement", {
        method: "PATCH",
        headers: {
          token: localStorage.getItem("AdminToken"),
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      if (json.status) {
        props.onHide();
      } else {
        alert(json.message);
        if (json.error === "jwt") {
          localStorage.removeItem("AdminToken");
        }
        window.location.reload(false);
      }
    };
    FetchAnnoucement();
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">ประกาศ 📢</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: "300px", overflowY: "scroll" }}>
          <h4>
            การอัพเดทเพิ่มเติม
            <span className="text-muted fs-6 ms-2">7/3/2565 20:16</span>
          </h4>

          <p>
            - ในการค้นหาเลข tracking สามารถหาตัวเลขลงท้ายที่ต้องการได้เพียงเพิ่ม
            / ตามด้วยเลขลงท้ายที่ต้องการค้นหา
          </p>
          <img src="/annoucement1.png" />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClick}>ไม่ต้องแสดงอีก</Button>
      </Modal.Footer>
    </Modal>
  );
}
