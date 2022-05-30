import React, { useState, useEffect } from "react";
import "./YahooOrder.css";
import ReactLoading from "react-loading";
import Loading from "../../../../Admin/components/Loading";
import {
  Button,
  Table,
  Modal,
  Container,
  Col,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import MagicBellClient from "@magicbell/core";

export default function YahooOrder() {
  const [orders, setOrders] = useState([]);
  const [temp, setTemp] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    const CheckSession = async () => {
      await fetch("/check/session", {
        headers: { token: localStorage.getItem("token") },
      })
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          if (!json.status) {
            alert(json.message);
            localStorage.removeItem("token");
            window.location.reload(false);
          }
        });
    };
    CheckSession();
  }, []);
  useEffect(() => {
    const FetchOrder = async () => {
      const json = await fetch("/api/yahoo/order", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      }).then((res) => res.json());
      if (json.status) {
        setOrders(json.data);
        setLoading(false);
      } else {
        if (json.error === "jwt") {
          alert("Your Login Session Is Expired,\nPlease Sign In Again!");
          localStorage.removeItem("token");
        } else {
          alert(json.message);
        }
        window.location.reload(false);
      }
    };
    FetchOrder();
  }, [trigger]);

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
            <th>Bidding</th>
            <th>Status</th>
            <th>Addbid</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {!loading && (
            <>
              {orders.map((item, index) => (
                <tr key={index}>
                  <td className="align-middle">{index + 1}</td>
                  <td className="align-middle">
                    <img src={item.imgsrc} width={100} alt={item.imgsrc} />
                  </td>
                  <td className="align-middle">
                    <a href={item.link} target="_blank" rel="noreferrer">
                      link
                    </a>
                  </td>
                  <td className="align-middle">
                    Maxbid: {item.maxbid} (¥)
                    {item.addbid1 !== null && (
                      <>
                        <br />
                        Addbid#1: {item.addbid1 === null
                          ? "-"
                          : item.addbid1}{" "}
                        (¥)
                        {item.addbid2 !== null && (
                          <>
                            <br />
                            Addbid#2:{" "}
                            {item.addbid2 === null ? "-" : item.addbid2} (¥)
                          </>
                        )}
                      </>
                    )}
                  </td>
                  <td className="align-middle">
                    {item.maxbid_work_by !== null ||
                    item.addbid1_work_by !== null ||
                    item.addbid2_work_by !== null
                      ? "กำลังประมูล"
                      : "รอเจ้าหน้าที่"}
                  </td>
                  <td className="align-middle">
                    <Button
                      size="sm"
                      onClick={() => handleShowAddbidModal(item)}
                    >
                      Addbid
                    </Button>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </Table>
      {loading && (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ReactLoading
              type={"bubbles"}
              color={"rgba(0,0,0,0.2)"}
              height={400}
              width={300}
            />
          </div>
        </>
      )}
      {!loading && orders.length === 0 && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "200px" }}
        >
          <h4>ไม่พบรายการสั่งประมูล!</h4>
        </div>
      )}
      <AddbidModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        item={temp}
        trigger={trigger}
        setTrigger={setTrigger}
      />
    </>
  );
}

function AddbidModal(props) {
  const [addbid1, setAddbid1] = useState("");
  const [addbid2, setAddbid2] = useState("");
  const [loading, setLoading] = useState(false);
  let link = props.item.link === undefined ? "" : props.item.link.split("/")[5];
  const notify = async (link, username, price, mode) => {
    const client = new MagicBellClient({
      apiKey: "c2cb12a6926a8cf70819eaf74181d85c779d2ab0",
      apiSecret: "Z53dqaY3vdRfqdNlV6lchjR6nOPpPDuZ1a7MSpUP",
    });
    let link_id = link.split("/")[link.split("/").length - 1].split("?")[0];
    const notifications = client.getStore();
    const notification = await notifications.create({
      title: "AddBid " + mode + "st",
      content: `${username}: linkId ${link_id} | Bid ${price} yen`,
      actionUrl: link,
      recipients: [{ email: "makara.atipat@gmail.com" }],
    });
  };
  const handleAddbid = (mode) => {
    setLoading(true);
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
          ? {
              addbid: addbid1,
              id: props.item.id,
              link: props.item.link,
              mode: 1,
            }
          : {
              addbid: addbid2,
              id: props.item.id,
              link: props.item.link,
              mode: 2,
            };
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
            notify(json.link, json.username, addbid.addbid, addbid.mode);
            props.setTrigger(!props.trigger);
            props.onHide();
            setLoading(false);
          } else {
            if (json.error === "jwt") {
              alert("Your Login Session Is Expired,\nPlease Sign In Again!");
              localStorage.removeItem("token");
            } else {
              alert(json.message);
            }
            window.location.reload(false);
          }
        });
    }
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
      {loading && <Loading />}
    </Modal>
  );
}
