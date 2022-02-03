import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Table, Col } from "react-bootstrap";

export default function Tracking() {
  const [trackings, setTrackings] = useState([]);
  useEffect(() => {
    fetch("/api/tracking", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setTrackings(json.data);
        } else {
          alert(json.message);
          localStorage.removeItem("token");
          window.location.reload(false);
        }
      });
  }, []);
  return (
    <>
      <h3 className="">Tracking</h3>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Date(y/m/d)</th>
            <th>Channel</th>
            <th>Track Id</th>
            <th>หมายเลขกล่อง</th>
            <th>weight</th>
            <th>รอบเรือ</th>
            <th>Pic1</th>
            <th>Pic2</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {trackings.map((item, index) => (
            <tr key={index}>
              <td className="align-middle">{index + 1}</td>
              <td className="align-middle">{item.date}</td>
              <td className="align-middle">{item.channel}</td>
              <td className="align-middle">{item.track_id}</td>
              <td className="align-middle">{item.box_id}</td>
              <td className="align-middle">{item.weight}</td>
              <td className="align-middle">{item.round_boat}</td>
              <td className="align-middle">
                <img
                  src={"/image/" + item.pic1_filename}
                  alt="image for pic1"
                  width={100}
                />
              </td>
              <td className="align-middle">
                <img
                  src={"/image/" + item.pic2_filename}
                  alt="image for pic2"
                  width={100}
                />
              </td>
              <td className="align-middle">{item.remark}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
