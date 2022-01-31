import React, { useState, useEffect } from "react";
import "./Tracking.css";

function Tracking() {
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
        }
      });
  }, []);

  return (
    <div className="Tracking">
      <h1 style={{ textAlign: "left" }}>Tracking</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th width="200px">Date</th>
            <th width="200px">หมายเลขกล่อง</th>
            <th>weight(kg.)</th>
            <th width="200px">รอบเรือ</th>
            <th width="200px">Noted</th>
            <th>PIC1</th>
            <th>PIC2</th>
          </tr>
        </thead>
        <tbody style={{ height: "70vh", overflowY: "scroll" }}>
          {trackings.map((item, i) => (
            <tr key={item.id}>
              <th>{i + 1}</th>
              <td>{item.date}</td>
              <td>{item.track_id}</td>
              <td>{item.weight}</td>
              <td>{item.round_boat}</td>
              <td>{item.remark}</td>
              <td>
                <img
                  src={`/image/${item.pic1_filename}`}
                  alt={item.pic1_filename}
                  width={"100px"}
                />
              </td>
              <td>
                <img
                  src={`/image/${item.pic2_filename}`}
                  alt={item.pic2_filename}
                  width={"100px"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tracking;
