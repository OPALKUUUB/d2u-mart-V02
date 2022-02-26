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
import Loading from "../../../../Admin/components/Loading";

export default function YahooAuction() {
  const history = useHistory();
  const [imgsrc, setImgsrc] = useState(null);
  const [link, setLink] = useState();
  const [price, setPrice] = useState();
  const [remark, setRemark] = useState();
  const [yen, setYen] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const FetchYen = async () => {
      const result = await fetch("/api/yen").then((res) => res.json());
      if (result.status) {
        setYen(result.yen);
        setLoading(false);
      } else {
        alert(result.message);
      }
    };
    FetchYen();
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
    } else if (remark === undefined) {
      setRemark("");
    }
    if (check === 1) {
      setLoading(true);
      let offer = { link: link, imgsrc: imgsrc, price: price, remark: remark };
      fetch("/api/yahoo/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(offer),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status) {
            setLoading(false);
            history.push("/auction/yahoo/order");
          } else {
            alert(json.message);
            if (json.error === "jwt") {
              localStorage.removeItem("token");
            }
            window.location.reload(false);
          }
        });
    }
  };
  return (
    <>
      {loading && <Loading />}
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
            {price > 0 && <>แปลงเป็นเงินไทย: {Math.round(price * yen)} บาท.</>}
          </Form.Text>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
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
