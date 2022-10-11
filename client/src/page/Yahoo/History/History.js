import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import { Table } from "react-bootstrap";
import ReactLoading from "react-loading";
import "./History.css";
import { ShowImage } from "../../../component/ShowImage/ShowImage";

const History = () => {
  const [orders, setOrders] = useState([]);
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
    const FetchOrder = async () => {
      const json = await fetch("/api/yahoo/history", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: JSON.parse(localStorage.getItem("token")).token,
        },
      }).then((res) => res.json());
      if (json.status) {
        setOrders(json.data);
      } else {
        if (json.error === "jwt") {
          alert("Your Login Session Is Expired,\nPlease Sign In Again!");
          localStorage.removeItem("token");
        } else {
          alert(json.message);
        }
        window.location.reload(false);
      }
      setLoading(false);
    };
    setLoading(true);
    FetchOrder();
  }, []);
  return (
    <Layout>
      <section className="YahooHistory">
        <div style={{ width: "100%", height: "480px", overflow: "scroll" }}>
          <Table
            responsive="sm"
            striped
            bordered
            hover
            style={{ background: "white" }}
          >
            <thead style={{ textAlign: "center" }}>
              <tr>
                <th>#</th>
                <th width={120}>Date</th>
                <th width={120}>Order</th>
                <th width={120}>Link</th>
                <th>Bid(yen)</th>
                <th>Tranfer Fee(bath)</th>
                <th>ค่าขนส่งในญี่ปุ่น(yen)</th>
                <th>Status</th>
                <th>Payment Status</th>
                <th>Track id</th>
                <th>หมายเลขกล่อง</th>
                <th>น้ำหนัก(kg.)</th>
                <th width={120}>รอบเรือ</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
              {!loading && (
                <>
                  {orders.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle">{index + 1}</td>
                      <td className="align-middle">
                        {genDate(item?.created_at)}
                      </td>
                      <td className="align-middle">
                        {/* <img src={item.imgsrc} width={100} /> */}
                        <ShowImage src={item.imgsrc} />
                      </td>
                      <td className="align-middle">
                        <a href={item.link} target="_blank">
                          {item.link.split("/")[5]}
                        </a>
                      </td>

                      <td className="align-middle">{item.bid} (¥)</td>
                      <td className="align-middle">
                        {item.tranfer_fee_injapan}
                      </td>
                      <td className="align-middle">{item.delivery_in_thai}</td>
                      <td className="align-middle">{item.status}</td>
                      <td className="align-middle">
                        {item.payment_status === null ||
                        item.payment_status === ""
                          ? "-"
                          : "ชำระเงินเรียบร้อยแล้ว"}
                      </td>
                      <td className="align-middle">{item.track_id}</td>
                      <td className="align-middle">{item.box_id}</td>
                      <td className="align-middle">{item.weight}</td>
                      <td className="align-middle">
                        {item.round_boat === null || item.round_boat === "" ? (
                          ""
                        ) : (
                          <>
                            {parseInt(item.round_boat.split("-")[2])}{" "}
                            {month[parseInt(item.round_boat.split("-")[1])]}
                          </>
                        )}
                        {/* {parseInt(item.round_boat.split("-")[2])}{" "}
              {month[parseInt(item.round_boat.split("-")[1])]} */}
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
              <h4>ไม่พบประวัติการประมูล!</h4>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

function genDate(input) {
  let input_split = input.split("T");
  if (input_split === undefined || input_split === null) {
    return input;
  }
  let d, m, y;
  if (input_split.length > 0) {
    let date = input_split[0].split("-");
    d = date[2];
    m = date[1];
    y = date[0];
    // console.log(m);
  } else {
    return input;
  }
  return `${d} ${month[parseInt(m)]} ${y}`;
}
const month = {
  1: "JAN",
  2: "FEB",
  3: "MAR",
  4: "APR",
  5: "MAY",
  6: "JUN",
  7: "JUL",
  8: "AUG",
  9: "SEPT",
  10: "OCT",
  11: "NOV",
  12: "DEC",
};

export default History;
