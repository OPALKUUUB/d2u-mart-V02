import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import ReactLoading from "react-loading";

export default function YahooHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/yahoo/history", {
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
          if (json.error === "jwt") {
            alert("Your Login Session Is Expired,\nPlease Sign In Again!");
            localStorage.removeItem("token");
          } else {
            alert(json.message);
          }
          window.location.reload(false);
        }
      });
  }, []);

  return (
    <>
      <h3 className="mb-3">Yahoo Auction Table</h3>
      <Table responsive="md" striped bordered hover size="sm">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Order</th>
            <th>Link</th>
            <th>Bid(yen)</th>
            <th>Tranfer Fee(bath)</th>
            <th>ค่าขนส่งในญี่ปุ่น(yen)</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Track id</th>
            <th>หมายเลขกล่อง</th>
            <th>น้ำหนัก(kg.)</th>
            <th>รอบเรือ</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {loading && (
            <>
              {orders.map((item, index) => (
                <tr key={index}>
                  <td className="align-middle">{index + 1}</td>
                  <td className="align-middle">{item.created_at}</td>
                  <td className="align-middle">
                    <img src={item.imgsrc} width={100} />
                  </td>
                  <td className="align-middle">
                    <a href={item.link} target="_blank">
                      {item.link.split("/")[5]}
                    </a>
                  </td>

                  <td className="align-middle">{item.bid} (¥)</td>
                  <td className="align-middle">{item.tranfer_fee_injapan}</td>
                  <td className="align-middle">{item.delivery_in_thai}</td>
                  <td className="align-middle">{item.status}</td>
                  <td className="align-middle">
                    {item.payment_status === null || item.payment_status === ""
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
    </>
  );
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
