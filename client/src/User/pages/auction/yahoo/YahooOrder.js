import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Container,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "./YahooOrder.css";
import ReactLoading from "react-loading";

export default function YahooOrder() {
  const [orders, setOrders] = useState([]);
  const [temp, setTemp] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/yahoo/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setOrders(json.data);
          setLoading(false);
        } else {
          alert(json.message);
          localStorage.removeItem("token");
          window.location.reload(false);
        }
      });
  }, []);

  const handleShowAddbidModal = (item) => {
    setModalShow(true);
    setTemp(item);
  };

  return (
    <>
      <h3 className="mb-3">Yahoo Order</h3>
      <Table responsive="md" striped bordered hover size="sm">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>#</th>
            <th>Order</th>
            <th>Link</th>
            <th>Maxbid/#1/#2</th>
            <th>Status</th>
            <th>Addbid</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {orders.map((item, index) => (
            <tr key={index}>
              <td className="align-middle">{index + 1}</td>
              <td className="align-middle">
                <img src={item.imgsrc} width={100} />
              </td>
              <td className="align-middle">
                <a href={item.link} target="_blank">
                  {item.link.split("/")[5]}
                </a>
              </td>
              <td className="align-middle">
                <p>
                  {item.maxbid}/{item.addbid1 === null ? "-" : item.addbid1}/
                  {item.addbid2 === null ? "-" : item.addbid2} (¥)
                </p>
              </td>
              <td className="align-middle">{item.status}</td>
              <td className="align-middle">
                <Button size="sm" onClick={() => handleShowAddbidModal(item)}>
                  Addbid
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {loading && (
        <>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              background: "rgba(0,0,0,0.3)",
              width: "100vw",
              height: "100vh",
              zIndex: "999",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <ReactLoading
                type={"bubbles"}
                color={"rgba(0,0,0,0.2)"}
                height={400}
                width={300}
              />
            </div>
          </div>
        </>
      )}
      <AddbidModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        item={temp}
      />
    </>
  );
}

function AddbidModal(props) {
  const [addbid1, setAddbid1] = useState("");
  const [addbid2, setAddbid2] = useState("");
  let link = props.item.link === undefined ? "" : props.item.link.split("/")[5];
  const handleAddbid = (mode) => {
    if (addbid1 === "" && props.item.addbid1 === null) {
      alert("Please fill price at addbid #1 before Add!");
    } else if (
      props.item.addbid1 !== null &&
      addbid2 === "" &&
      props.item.addbid2 === null
    ) {
      alert("Please fill price at addbid #2 before Add!");
    } else {
      let addbid =
        mode === 1
          ? { addbid: addbid1, id: props.item.id, mode: 1 }
          : { addbid: addbid2, id: props.item.id, mode: 2 };
      fetch("/api/yahoo/order/addbid", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(addbid),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status) {
            alert(json.message);
            props.onHide();
          } else {
            alert(json.message);
            localStorage.removeItem("token");
          }
        });
    }
    window.location.reload(false);
  };
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Addbid</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <Col md>
            <p>Link: {link}</p>
            {props.item.addbid1 === null ? (
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Addbid #1"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  onChange={(e) => setAddbid1(e.target.value)}
                  type="number"
                />
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  onClick={() => handleAddbid(1)}
                >
                  Add
                </Button>
              </InputGroup>
            ) : (
              <p>Addbid #1: {props.item.addbid1} (¥)</p>
            )}
          </Col>
          <Col md>
            {props.item.addbid2 === null ? (
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Addbid #2"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  onChange={(e) => setAddbid2(e.target.value)}
                  disabled={props.item.addbid1 === null}
                  type="number"
                />
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  onClick={() => handleAddbid(2)}
                >
                  Add
                </Button>
              </InputGroup>
            ) : (
              <p>Addbid #2: {props.item.addbid2} (¥)</p>
            )}
          </Col>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
