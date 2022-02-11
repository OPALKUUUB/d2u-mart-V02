import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

export default function YahooHistory() {
  const [orders, setOrders] = useState([]);
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
        } else {
          alert(json.message);
          localStorage.removeItem("token");
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
            <th>Tranfer fee(bath)</th>
            <th>Delivery(yen)</th>
            <th>Status</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
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

              <td className="align-middle">
                <div>{item.bid} (¥)</div>
              </td>
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
        </tbody>
      </Table>
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
