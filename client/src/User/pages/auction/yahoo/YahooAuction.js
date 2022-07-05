import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import {
  Button,
  Col,
  Figure,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import Loading from "../../../components/Loading";
// NPM package at https://www.npmjs.com/package/@magicbell/core
// yarn add @magicbell/core

import MagicBellClient from "@magicbell/core";
import { useNavigate } from "react-router-dom";

export default function YahooAuction() {
  // const history = useHistory();
  const navigate = useNavigate();
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
  useEffect(() => {
    const CheckSession = async () => {
      await fetch("/check/session", {
        headers: { token: JSON.parse(localStorage.getItem("token")).token },
      })
        .then((res) => res.json())
        .then((json) => {
          // console.log(json);
          if (!json.status) {
            alert(json.message);
            localStorage.removeItem("token");
            window.location.reload(false);
          }
        });
    };
    CheckSession();
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
  const notify = async (obj, username) => {
    const client = new MagicBellClient({
      apiKey: "c2cb12a6926a8cf70819eaf74181d85c779d2ab0",
      apiSecret: "Z53dqaY3vdRfqdNlV6lchjR6nOPpPDuZ1a7MSpUP",
    });
    let link_id = obj.link
      .split("/")
      [obj.link.split("/").length - 1].split("?")[0];
    // console.log(link_id);
    const notifications = client.getStore();
    const notification = await notifications.create({
      title: "Yahoo Order",
      content: `${username}: linkId ${link_id} | Maxbid ${obj.price} yen`,
      actionUrl: obj.link,
      recipients: [{ email: "makara.atipat@gmail.com" }],
    });
  };
  const handleSubmitOffer = (e) => {
    e.preventDefault();
    if (
      window.confirm(`
      ในบางช่วงเวลา อาจมีลูกใช้บริการเป็นจำนวนมาก คำแนะนำสำหรับคุณลูกค้า เพื่อไม่ให้เสียโอกาสในการประมูลคือ
        -ควรใส่ราคาประมูลสูงสุดที่รับไหว
        -ควรส่งก่อนหมดเวลาอย่างน้อย 15 นาที
      ขอบคุณคุณลูกค้าทุกท่านที่ให้ความร่วมมือกับทางร้านค่ะ`)
    ) {
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
        let offer = {
          link: link,
          imgsrc: imgsrc,
          price: price,
          remark: remark,
        };
        fetch("/api/yahoo/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: JSON.parse(localStorage.getItem("token")).token,
          },
          body: JSON.stringify(offer),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.status) {
              notify(offer, json.username);
              setLoading(false);
              console.log(json);
              // navigate("/auction/yahoo/order");
            } else {
              alert(json.message);
              if (json.error === "jwt") {
                localStorage.removeItem("token");
              }
              window.location.reload(false);
            }
          });
      }
    }
  };
  return (
    <div style={{ background: "#fdeee4", width: "100vw", height: "100vh" }}>
      <div style={{ paddingTop: "30px", width: "80vw", margin: "0 auto" }}>
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
              {price > 0 && (
                <>แปลงเป็นเงินไทย: {Math.round(price * yen)} บาท.</>
              )}
            </Form.Text>
            <Form.Group
              className="mb-3"
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
      </div>
    </div>
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
