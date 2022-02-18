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
          console.log(json.data);
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
              {item.channel === "yahoo" ? (
                <>
                  <td className="align-middle">{index + 1}</td>
                  <td className="align-middle">
                    {item.created_at.split("T")[0]}
                  </td>
                  <td className="align-middle">{item.channel}</td>
                  <td className="align-middle">{item.track_id}</td>
                  <td className="align-middle">{item.box_id}</td>
                  <td className="align-middle">{item.weight}</td>
                  <td className="align-middle">{item.round_boat}</td>
                  <td className="align-middle">
                    <img src={item.imgsrc} alt="image for pic1" width={100} />
                  </td>
                  <td className="align-middle text-center">-</td>
                  <td className="align-middle text-center">-</td>
                </>
              ) : (
                <>
                  <td className="align-middle">{index + 1}</td>
                  <td className="align-middle">
                    {item.date !== null && item.date !== "" ? (
                      <>
                        {item.date.split("-")[2]}{" "}
                        {month[parseInt(item.date.split("-")[1])]}{" "}
                        {item.date.split("-")[0]}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="align-middle">{item.channel}</td>
                  <td className="align-middle">{item.track_id}</td>
                  <td className="align-middle">{item.box_id}</td>
                  <td className="align-middle">{item.weight}</td>
                  <td className="align-middle">
                    {item.round_boat !== null && item.round_boat !== "" ? (
                      <>
                        {item.round_boat.split("-")[2]}{" "}
                        {month[parseInt(item.round_boat.split("-")[1])]}
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="align-middle">
                    <img
                      src={item.pic1_filename}
                      alt="image for pic1"
                      width={100}
                    />
                  </td>
                  <td className="align-middle">
                    <img
                      src={item.pic2_filename}
                      alt="image for pic2"
                      width={100}
                    />
                  </td>
                  <td className="align-middle">{item.remark}</td>
                </>
              )}
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
