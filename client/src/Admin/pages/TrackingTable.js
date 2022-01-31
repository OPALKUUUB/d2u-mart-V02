import React, { useState, useEffect } from "react";
import ModalAddTracking from "../components/ModalAddTracking";
import ModalUpdateTracking from "../components/ModalUpdateTracking";
import "./TrackingTable.css";

function TrackingTable() {
  const [trackings, setTrackings] = useState([]);
  const [showModalAddTracking, setShowModalAddTracking] = useState(false);
  const [showModalUpdateTracking, setShowModalUpdateTracking] = useState(false);
  const [updateId, setUpdateId] = useState();

  useEffect(() => {
    fetch("/api/admin/tracking", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  const handleCloseModalAddTracking = () => {
    setShowModalAddTracking(false);
  };
  const handleCloseModalUpdateTracking = () => {
    setShowModalUpdateTracking(false);
  };

  const handleButtonUpdate = (id) => {
    setUpdateId(id);
    setShowModalUpdateTracking(true);
  };

  return (
    <div className="TrackingTable">
      <button type="button" onClick={() => setShowModalAddTracking(true)}>
        Add Tracking
      </button>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>success</th>
            <th width="200px">Date</th>
            <th width="200px">Username</th>
            <th width="200px">หมายเลขกล่อง</th>
            <th>weight(kg.)</th>
            <th width="200px">รอบเรือ</th>
            <th>Noted</th>
            <th>PIC1</th>
            <th>PIC2</th>
            <th>manage</th>
          </tr>
        </thead>
        <tbody>
          {trackings.map((item, i) => (
            <tr key={item.id}>
              <th>{i + 1}</th>
              <td>
                <input type="checkbox" />
              </td>
              <td>{item.date}</td>
              <td>{item.username}</td>
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
              <td>
                <button
                  type="button"
                  onClick={() => handleButtonUpdate(item.id)}
                >
                  แก้ไข
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <ModalAddTracking /> */}
      {showModalAddTracking && (
        <ModalAddTracking close={handleCloseModalAddTracking} />
      )}
      {showModalUpdateTracking && (
        <ModalUpdateTracking
          close={handleCloseModalUpdateTracking}
          id={updateId}
        />
      )}
    </div>
  );
}

export default TrackingTable;
