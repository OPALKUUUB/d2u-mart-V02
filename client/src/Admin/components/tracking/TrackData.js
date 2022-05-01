import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Loading from "../Loading";
import ShowImage from "../ShowImage";
import UpdateTrackingModal from "../UpdateTrackingModal";

export default function TrackData({
  trackings,
  setTrackings,
  mode,
  header,
  trigger,
  setTrigger,
}) {
  const [load, setLoad] = useState(false);
  const [image, setImage] = useState("");
  const [modalShowImage, setModalShowImage] = useState(false);
  const [modalShowUpdate, setModalShowUpdate] = useState(false);
  const [temp, setTemp] = useState({});
  const isNotValue = (obj) => {
    return !(obj !== undefined && obj !== null && obj !== "");
  };
  const UpdateCheck = async (check, id, ckmode) => {
    await fetch(`/api/admin/track/v2/check/${ckmode}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        check: check ? 1 : 0,
      }),
    })
      .then((res) => setLoad(false))
      .catch((err) => alert(err));
  };
  const handleCheck = (e, id, ckmode) => {
    // console.log(e.target.checked, id, ckMode);
    setLoad(true);
    UpdateCheck(e.target.checked, id, ckmode);
  };
  const handleDelete = (id, index) => {
    if (window.confirm("คุณต้องการที่จะลบข้อมูลที่ " + index + "?")) {
      let idx = -1;
      for (let i = 0; i < trackings.length; i++) {
        if (trackings[i].id === id) {
          idx = i;
          break;
        }
      }
      setTrackings([...trackings.slice(0, idx), ...trackings.slice(idx + 1)]);
      DeleteTrack(id);
    }
  };
  const DeleteTrack = async (id) => {
    await fetch("/api/admin/tracking", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setTrigger(!trigger);
          console.log("delete done");
        } else {
          alert(json.message);
          window.localStorage.removeItem("AdminToken");
          window.location.reload(false);
        }
      });
  };

  return (
    <>
      {trackings.map((item, index) => {
        let temp = item.date;
        let date;
        // console.log(temp === undefined, temp === "");
        if (temp !== undefined && temp !== "" && temp !== null) {
          let d = temp.split("-")[2];
          let m = month[parseInt(temp.split("-")[1])];
          let y = temp.split("-")[0];
          date = `${d} ${m} ${y}`;
        } else {
          date = "-/-/-";
        }
        temp = item.round_boat;
        let date2;
        if (temp !== undefined && temp !== "" && temp !== null) {
          let d = temp.split("-")[2];
          let m = month[parseInt(temp.split("-")[1])];
          date2 = `${d} ${m}`;
        } else {
          date2 = "-/-/-";
        }

        return (
          <tr key={index}>
            <td className="align-middle">{index + 1}</td>
            <td className="align-middle">{date}</td>
            <td className="align-middle">{item.username}</td>
            <td className="align-middle">
              <a href={item.url} target="_blank">
                link
              </a>
            </td>
            <td className="align-middle">
              {isNotValue(item.track_id) ? "-" : item.track_id}
            </td>
            <td className="align-middle">
              {isNotValue(item.box_id) ? "-" : item.box_id}
            </td>
            <td className="align-middle">
              {isNotValue(item.weight) ? "-" : item.weight}
            </td>
            <td className="align-middle">
              {isNotValue(item.q) ? "-" : item.q}
            </td>
            {mode !== "shimizu" && (
              <td className="align-middle">
                {isNotValue(item.price) ? "-" : item.price}
              </td>
            )}
            <td className="align-middle">
              {isNotValue(item.point) ? "-" : item.point}
            </td>
            <td className="align-middle">{date2}</td>
            {mode !== "shimizu" && (
              <>
                <td className="align-middle">
                  {isNotValue(item.pic1_filename) ? (
                    "-"
                  ) : (
                    <img
                      onClick={() => {
                        setImage(item.pic1_filename);
                        setModalShowImage(true);
                      }}
                      src={item.pic1_filename}
                      alt="image for pic1"
                      width={50}
                    />
                  )}
                </td>
                <td className="align-middle">
                  {isNotValue(item.pic2_filename) ? (
                    "-"
                  ) : (
                    <img
                      onClick={() => {
                        setImage(item.pic1_filename);
                        setModalShowImage(true);
                      }}
                      src={item.pic2_filename}
                      alt="image for pic2"
                      width={50}
                    />
                  )}
                </td>
              </>
            )}
            <td className="align-middle text-center">
              <input
                type="checkbox"
                defaultChecked={item.check1}
                onChange={(e) => handleCheck(e, item.id, 1)}
              />
            </td>
            <td className="align-middle text-center">
              <input
                type="checkbox"
                defaultChecked={item.check2}
                onChange={(e) => handleCheck(e, item.id, 2)}
              />
            </td>
            <td className="align-middle" width={150}>
              {isNotValue(item.remark) ? "-" : item.remark}
            </td>
            <td className="align-middle">
              <div style={{ display: "flex" }}>
                <Button
                  size="sm"
                  onClick={() => {
                    setTemp(item);
                    setModalShowUpdate(true);
                  }}
                  variant="success"
                >
                  <i className="fas fa-pencil-alt"></i>
                </Button>
                &nbsp;
                <Button
                  variant="danger"
                  onClick={() => handleDelete(item.id, index + 1)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </td>
          </tr>
        );
      })}
      <ShowImage
        show={modalShowImage}
        onHide={() => setModalShowImage(false)}
        src={image}
      />

      <UpdateTrackingModal
        show={modalShowUpdate}
        onHide={() => setModalShowUpdate(false)}
        item={temp}
        mode={mode}
        header={header}
        trigger={trigger}
        setTrigger={setTrigger}
      />
      {load && <Loading />}
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
