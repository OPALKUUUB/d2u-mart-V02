import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading";
import { Button, Modal } from "react-bootstrap";
import styled from "styled-components";
const Styles = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 20px 0;
  #header {
    margin-bottom: 20px;
  }
  .box-item {
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    padding: 10px;
    max-height: 250px;
    overflow: scroll;
  }
  .box-item .item {
    display: flex;
    column-gap: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
  #upload-slip {
    width: 300px;
  }
`;
export default function YahooAllPayment(props) {
  const location = useLocation();
  const [yen, setYen] = useState("");
  const [payment, setPayment] = useState(location.state);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [slipImageFilename, setSlipImageFilename] = useState("");
  const [arrId, setArrId] = useState([]);
  const [sum, setSum] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const CheckSession = async () => {
      await fetch("/check/session", {
        headers: { token: JSON.parse(localStorage.getItem("token")).token },
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
          setLoading(false);
        } else {
          alert(json.message);
          window.location.reload(false);
        }
      });
  }, []);

  useEffect(() => {
    setPayment(location.state);
  }, [location.state]);

  const handleSumPayment = () => {
    let temp = 0;
    for (let i = 0; i < payment.length; i++) {
      temp += Math.round(
        (payment[i].bid + payment[i].delivery_in_thai) * yen +
          payment[i].tranfer_fee_injapan
      );
    }
    return temp;
  };

  const handleFileChange = (e) => {
    if (e.target.files[0] === undefined) {
      setFile(null);
      setImage(null);
    } else {
      setFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = () => {
    if (file === null) {
      alert(`กรุณาเลือกใบเสร็จ!`);
    } else {
      const FetchPostImage = async () => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "d2u-service");
        data.append("cloud_name", "d2u-service");
        const result = await fetch(
          "https://api.cloudinary.com/v1_1/d2u-service/upload",
          {
            method: "POST",
            body: data,
          }
        ).then((resp) => resp.json());
        let temp = [];
        for (let i = 0; i < payment.length; i++) {
          temp.push(payment[i].id);
        }
        setArrId(temp);
        setSlipImageFilename(result.url);
        setSum(handleSumPayment());
        setModalShow(true);
        setLoading(false);
      };
      setLoading(true);
      FetchPostImage();
    }
  };

  return (
    <>
      <Styles>
        <h3 id="header">Payment</h3>
        <div className="box-item">
          {location.state.map((item, index) => (
            <>
              <div className="item">
                <div className="left">
                  <img src={item.imgsrc} width="120px" alt={item.imgsrc} />
                </div>
                <div className="right">
                  <div>{item.link.split("/")[5]}</div>
                  <div>Bid: {item.bid} (¥)</div>
                  <div>ค่าโอน: {item.tranfer_fee_injapan} (฿)</div>
                  <div>ค่าขนส่งในญี่ปุ่น: {item.delivery_in_thai} (¥)</div>
                </div>
              </div>
              <div className="item">
                <div className="left">
                  <img src={item.imgsrc} width="120px" alt={item.imgsrc} />
                </div>
                <div className="right">
                  <div>{item.link.split("/")[5]}</div>
                  <div>Bid: {item.bid} (¥)</div>
                  <div>ค่าโอน: {item.tranfer_fee_injapan} (฿)</div>
                  <div>ค่าขนส่งในญี่ปุ่น: {item.delivery_in_thai} (¥)</div>
                </div>
              </div>
              <div className="item">
                <div className="left">
                  <img src={item.imgsrc} width="120px" alt={item.imgsrc} />
                </div>
                <div className="right">
                  <div>{item.link.split("/")[5]}</div>
                  <div>Bid: {item.bid} (¥)</div>
                  <div>ค่าโอน: {item.tranfer_fee_injapan} (฿)</div>
                  <div>ค่าขนส่งในญี่ปุ่น: {item.delivery_in_thai} (¥)</div>
                </div>
              </div>
            </>
          ))}
        </div>
        <div className="box-payment">
          <div>
            <span className="text-muted">
              Payment rate is 1 yen : {yen} bath
            </span>
            <p>
              Amount Order({location.state.length})
              <br />
              Sum: {handleSumPayment()} bath
            </p>
            <p>
              สามารถชำระเงินผ่านเลขที่บัญชี: <span>1652798843</span>
              <br />
              (ธ.ไทยพาณิช เสาวนีย์ เสถียรทนุพงษ์)
              <div>
                <img
                  src="/resource/qr_scb.jpeg"
                  alt="deliverytoyou"
                  width={150}
                />
              </div>
            </p>
            <div id="upload-slip">
              <label className="form-label">Upload Slip</label>
              <input
                className="form-control"
                type="file"
                name="slipImage"
                onChange={handleFileChange}
              />
            </div>
            <span className="text-muted">
              Please Upload Slip Before Submit Payment
            </span>
          </div>
          <button className="btn btn-success mt-3" onClick={handleUpload}>
            Submit
          </button>
          {/* submit for upload image and show modal for confirm and send to database */}
        </div>
      </Styles>
      {/* Loadin */}
      {loading && <Loading />}
      {/* Modal */}
      <ConfirmAddSlipModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        image={image}
        slipFilename={slipImageFilename}
        amount={location.state.length}
        sum={sum}
        arrId={arrId}
      />
    </>
  );
}

function ConfirmAddSlipModal(props) {
  // const history = useHistory();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    fetch("/api/yahoo/payment", {
      method: "PATCH",
      headers: {
        token: JSON.parse(localStorage.getItem("token")).token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId: props.arrId,
        slip_image_filename: props.slipFilename,
        price: props.sum,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setLoading(false);
          // history.push("/auction/yahoo/payment");
          navigate("/auction/yahoo/payment");
        } else {
          if (data.error === "jwt") {
            alert("Your Login Session Is Expired,\nPlease Sign In Again!");
            localStorage.removeItem("token");
          } else {
            alert(data.message);
          }
          window.location.reload(false);
        }
      });
  };
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Confirm</h4>
          <p>
            Amount Order({props.amount})
            <br />
            Sum: {props.sum} bath
          </p>
          <img src={props.image} width={100} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>Confirm</Button>
          <Button onClick={props.onHide} variant="secondary">
            Close
          </Button>
        </Modal.Footer>
        {loading && <Loading />}
      </Modal>
    </>
  );
}
