import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";

export default function HistoryTable() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    fetch("/api/admin/yahoo/history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("AdminToken"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setOrders(json.data);
        } else {
          alert(json.message);
          localStorage.removeItem("AdminToken");
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
            <th>Username</th>
            <th>Link</th>
            <th>Bid(yen)</th>
            <th>tranfer fee(bath)</th>
            <th>delivery(yen)</th>
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
              <td className="align-middle">{item.username}</td>
              <td className="align-middle">
                <a href={item.link} target="_blank">
                  {item.link.split("/")[5]}
                </a>
              </td>

              <td className="align-middle">
                <div>{item.bid} (¥)</div>
                <div style={{ backgroundColor: "yellow" }}>{item.bid_by}</div>
              </td>
              <td className="align-middle">{item.tranfer_fee_injapan}</td>
              <td className="align-middle">{item.delivery_in_thai}</td>
              <td className="align-middle">{item.status}</td>
              <td className="align-middle">{item.payment_status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
