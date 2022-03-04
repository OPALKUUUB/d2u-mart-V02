import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Col,
  Figure,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import AutoComplete from "../components/AutoComplete";
import ReactLoading from "react-loading";

export default function AuctionAdmin() {
  const history = useHistory();
  const [imgsrc, setImgsrc] = useState(null);
  const [link, setLink] = useState();
  const [price, setPrice] = useState();
  const [remark, setRemark] = useState();
  const [username, setUsername] = useState();
  const [yen, setYen] = useState();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(async () => {
    await fetch("/api/yen", {
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
    await fetch("/api/admin/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setUsers(json.data);
          setLoading(false);
        } else {
          alert(json.message);
        }
      });
  }, []);

  const handleSearchImgsrc = () => {
    fetch("/api/yahoo/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link: link }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setImgsrc(json.imgsrc);
        } else {
          alert(json.message);
        }
      });
  };
  const handleSubmitOffer = (e) => {
    e.preventDefault();
    let check = 1;
    if (link === "" || link === undefined) {
      alert("Please fill link");
      check = 0;
    } else if (imgsrc === null) {
      alert("Please click search for upload image");
      check = 0;
    } else if (price === "" || price === undefined) {
      alert("Please fill price");
      check = 0;
    } else if (username === "" || username === undefined) {
      alert("Please fill username");
      check = 0;
    } else if (remark === undefined) {
      setRemark("");
    }
    if (check === 1) {
      let offer = {
        username: username,
        link: link,
        imgsrc: imgsrc,
        price: price,
        remark: remark,
      };
      fetch("/api/admin/yahoo/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offer),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status) {
            alert(json.message);
            history.push("/admin/table/yahoo/auction");
          } else {
            alert(json.message);
          }
        });
    }
  };
  const handleChangeUsername = (data) => {
    if (data.length !== 0) {
      setUsername(data[0].username);
    } else {
      setUsername("");
    }
  };
  return (
    <>
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
      {!loading && (
        <>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Example https://page.auctions.yahoo.co.jp/jp/auction/x0000000"
              aria-label="Enter Your yahoo link"
              aria-describedby="link-yahoo-auction"
              style={{ textAlign: "center" }}
              onChange={(e) => setLink(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              id="link-yahoo-auction"
              onClick={handleSearchImgsrc}
            >
              Search
            </Button>
          </InputGroup>
          <Row>
            <Col md>
              {imgsrc === null ? (
                <div style={style.imgPlacehd}>please search link...</div>
              ) : (
                <Figure>
                  <Figure.Image width="100%" alt="300x..." src={imgsrc} />
                </Figure>
              )}
            </Col>
            <Col md>
              <h3>Offer Price</h3>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <AutoComplete
                  arr={users}
                  handleChange={handleChangeUsername}
                  label="username"
                  placeholder={"Select username"}
                />
              </Form.Group>

              <InputGroup className="mb-3">
                <InputGroup.Text>¥</InputGroup.Text>
                <FormControl
                  aria-label="Amount (to the nearest yen)"
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  placeholder="หน่วยเป็นเยน"
                />
                <InputGroup.Text>.00</InputGroup.Text>
              </InputGroup>
              <Form.Text className="text-muted">
                (1 yen: {yen} bath){" "}
                {price > 0 && (
                  <>แปลงเป็นเงินไทย: {Math.round(price * yen)} บาท.</>
                )}
              </Form.Text>
              <Form.Group
                className="mb-3 mt-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="(เช่น ราคาไม่รวมภาษี หรือ ไม่รวมค่าส่ง)"
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSubmitOffer}>
                Submit
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

let style = {
  imgPlacehd: {
    width: "100%",
    height: "300px",
    background: "rgba(0,0,0,0.5)",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
