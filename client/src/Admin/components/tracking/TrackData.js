import React, { useEffect, useState } from "react";
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
  FetchTrackings,
}) {
  const [load, setLoad] = useState(false);
  const [image, setImage] = useState("");
  const [modalShowImage, setModalShowImage] = useState(false);
  const [modalShowUpdate, setModalShowUpdate] = useState(false);
  const [temp, setTemp] = useState({});

  return (
    <>
      {!load &&
        trackings.map((item, index) => (
          <TableData
            key={index}
            item={item}
            mode={mode}
            index={index}
            image={image}
            setImage={setImage}
            temp={temp}
            setTemp={setTemp}
            setModalShowImage={setModalShowImage}
            setModalShowUpdate={setModalShowUpdate}
            trigger={trigger}
            setTrigger={setTrigger}
            FetchTrackings={FetchTrackings}
            load={load}
            setLoad={setLoad}
          />
        ))}
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

function TableData({
  item,
  index,
  mode,
  setImage,
  setTemp,
  setModalShowImage,
  setModalShowUpdate,
  FetchTrackings,
}) {
  const isNotValue = (obj) => {
    return !(obj !== undefined && obj !== null && obj !== "");
  };
  const handleDelete = (id, index) => {
    if (window.confirm("คุณต้องการที่จะลบข้อมูลที่ " + index + "?")) {
      // let idx = -1;
      // for (let i = 0; i < trackings.length; i++) {
      //   if (trackings[i].id === id) {
      //     idx = i;
      //     break;
      //   }
      // }
      // setTrackings([...trackings.slice(0, idx), ...trackings.slice(idx + 1)]);

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
          FetchTrackings();
          console.log("delete done");
        } else {
          alert(json.message);
          window.localStorage.removeItem("AdminToken");
          window.location.reload(false);
        }
      });
  };

  let t = item.date;
  let date;
  // console.log(t === undefined, t === "");
  if (t !== undefined && t !== "" && t !== null) {
    let d = t.split("-")[2];
    let m = month[parseInt(t.split("-")[1])];
    let y = t.split("-")[0];
    date = `${d} ${m} ${y}`;
  } else {
    date = "-/-/-";
  }
  t = item.round_boat;
  let date2;
  if (t !== undefined && t !== "" && t !== null) {
    let d = t.split("-")[2];
    let m = month[parseInt(t.split("-")[1])];
    date2 = `${d} ${m}`;
  } else {
    date2 = "-/-/-";
  }
  return (
    <tr key={item.id}>
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
      <td className="align-middle">{isNotValue(item.q) ? "-" : item.q}</td>
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
        {/* <p>{item.check1 === null && "null"}</p>
        <p>{item.check1 === 1 && "checked"}</p>
        <p>{item.check1 === 0 && "uncheck"}</p> */}
        <InputCheck
          id={item.id}
          check={item.check1 === null ? 0 : item.check1}
          ckmode={1}
        />
      </td>
      <td className="align-middle text-center">
        {/* <p>{item.check2 === null && "null"}</p>
        <p>{item.check2 === 1 && "checked"}</p>
        <p>{item.check2 === 0 && "uncheck"}</p> */}
        <InputCheck
          id={item.id}
          check={item.check2 === null ? 0 : item.check2}
          ckmode={2}
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
}

function InputCheck({ check, id, ckmode }) {
  const [itc, setItc] = useState(check);

  useEffect(() => {
    setItc(check);
  }, [check]);

  const UpdateCheck = async (ck) => {
    await fetch(`/api/admin/track/v2/check/${ckmode}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        check: ck ? 1 : 0,
      }),
    })
      .then((res) => {
        setItc(ck);
      })
      .catch((err) => alert(err));
  };
  const handleCheck = (e) => {
    UpdateCheck(e.target.checked);
  };
  return (
    <input key={id} type="checkbox" checked={itc} onChange={handleCheck} />
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
