import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import ReactLoading from "react-loading";
import { ShowImage } from "../components/ShowImage";
export default function Tracking() {
  const [trackings, setTrackings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [modalShowImage, setModalShowImage] = useState(false);
  useEffect(() => {
    fetch("/check/session", {
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
  }, []);
  useEffect(() => {
    fetch("/api/tracking", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: JSON.parse(localStorage.getItem("token")).token,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setTrackings(json.data);
          setLoading(false);
        } else {
          alert(json.message);
          if (json.error === "jwt") {
            localStorage.removeItem("token");
          }
          window.location.reload(false);
        }
      });
  }, []);
  return (
    <div style={{ background: "#fdeee4", width: "100vw", height: "100vh" }}>
      <div style={{ paddingTop: "30px", width: "80vw", margin: "0 auto" }}>
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
            </tr>
          </thead>
          <tbody>
            {!loading && (
              <>
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
                          <img
                            src={item.imgsrc}
                            alt="image for pic1"
                            width={100}
                          />
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
                          {item.round_boat !== null &&
                          item.round_boat !== "" ? (
                            <>
                              {item.round_boat.split("-")[2]}{" "}
                              {month[parseInt(item.round_boat.split("-")[1])]}
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="align-middle">
                          {item.pic1_filename === null ||
                          item.pic1_filename === "" ? (
                            "-"
                          ) : (
                            <img
                              src={item.pic1_filename}
                              onClick={() => {
                                setImage(item.pic1_filename);
                                setModalShowImage(true);
                              }}
                              alt="image for pic1"
                              width={100}
                            />
                          )}
                        </td>
                        <td className="align-middle">
                          {item.pic2_filename === null ||
                          item.pic2_filename === "" ? (
                            "-"
                          ) : (
                            <img
                              src={item.pic2_filename}
                              onClick={() => {
                                setImage(item.pic2_filename);
                                setModalShowImage(true);
                              }}
                              alt="image for pic2"
                              width={100}
                            />
                          )}
                        </td>
                      </>
                    )}
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
        {!loading && trackings.length === 0 && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "200px" }}
          >
            <h4>ไม่พบรายการติดตามสินค้า!</h4>
          </div>
        )}
        <ShowImage
          show={modalShowImage}
          onHide={() => setModalShowImage(false)}
          src={image}
        />
      </div>
    </div>
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
