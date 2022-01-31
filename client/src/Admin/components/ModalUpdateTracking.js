import React, { useState, useEffect } from "react";
import "./ModalUpdateTracking.css";

function ModalUpdateTracking(props) {
  const [tracking, setTracking] = useState(trackingModel);
  const [pic1File, setPic1File] = useState(null);
  const [pic2File, setPic2File] = useState(null);
  const handleChangeTracking = (e) => {
    setTracking({ ...tracking, [e.target.name]: e.target.value });
  };
  const handleSelectPic1File = (e) => {
    setPic1File(e.target.files[0]);
  };
  const removeSelectedPic1File = () => {
    setPic1File(null);
  };
  const handleSelectPic2File = (e) => {
    setPic2File(e.target.files[0]);
  };
  const removeSelectedPic2File = () => {
    setPic2File(null);
  };

  useEffect(() => {
    fetch("/api/admin/tracking/" + props.id, { method: "GET" })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          // console.log(json.tracking);
          setTracking(json.tracking);
        } else {
          alert(json.message);
        }
      });
  }, []);

  const handleUploadPic1File = () => {
    if (pic1File === null) {
      alert(`please choose slip first!`);
    } else {
      const fd = packFile(pic1File);
      fetch(`/api/upload`, {
        method: "POST",
        body: fd,
      })
        .then((res) => res.json())
        .then((result) => {
          alert("upload slip successfully");
          setTracking({
            ...tracking,
            pic1_filename: result.filename,
          });
        })
        .catch((err) => console.log(err));
    }
  };
  const handleUploadPic2File = () => {
    if (pic2File === null) {
      alert(`please choose slip first!`);
    } else {
      const fd = packFile(pic2File);
      fetch(`/api/upload`, {
        method: "POST",
        body: fd,
      })
        .then((res) => res.json())
        .then((result) => {
          alert("upload slip successfully");
          setTracking({
            ...tracking,
            pic2_filename: result.filename,
          });
        })
        .catch((err) => console.log(err));
    }
  };
  const handleUpdateTracking = () => {
    // console.log(tracking);
    fetch("/api/admin/tracking/" + props.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tracking),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          alert(json.message);
          props.close();
          window.location.reload(false);
        } else {
          alert(json.message);
        }
      });
  };

  return (
    <div className="ModalUpdateTracking-layout">
      <div className="ModalUpdateTracking-container">
        <div className="ModalUpdateTracking-header">
          <h3>Update Tracking(id: {props.id})</h3>
        </div>
        <div className="ModalUpdateTracking-body">
          <div className="ModalUpdateTracking-form-group">
            <label htmlFor="date" className="ModalUpdateTracking-form-label">
              date
            </label>
            <input
              className="ModalUpdateTracking-form-control"
              type="date"
              name="date"
              onChange={handleChangeTracking}
              value={tracking.date}
            />
          </div>
          <div className="ModalUpdateTracking-form-group">
            <label
              htmlFor="username"
              className="ModalUpdateTracking-form-label"
            >
              username
            </label>
            <input
              className="ModalUpdateTracking-form-control"
              type="text"
              name="username"
              onChange={handleChangeTracking}
              value={tracking.username}
            />
          </div>
          <div className="ModalUpdateTracking-form-group">
            <label
              htmlFor="track_id"
              className="ModalUpdateTracking-form-label"
            >
              track_id
            </label>
            <input
              className="ModalUpdateTracking-form-control"
              type="text"
              name="track_id"
              onChange={handleChangeTracking}
              value={tracking.track_id}
            />
          </div>
          <div className="ModalUpdateTracking-form-group">
            <label htmlFor="weight" className="ModalUpdateTracking-form-label">
              weight(kg.)
            </label>
            <input
              className="ModalUpdateTracking-form-control"
              type="number"
              name="weight"
              onChange={handleChangeTracking}
              value={tracking.weight}
            />
          </div>
          <div className="ModalUpdateTracking-form-group">
            <label
              htmlFor="round_boat"
              className="ModalUpdateTracking-form-label"
            >
              round_boat
            </label>
            <input
              className="ModalUpdateTracking-form-control"
              type="date"
              name="round_boat"
              onChange={handleChangeTracking}
              value={tracking.round_boat}
            />
          </div>
          <div className="ModalUpdateTracking-form-group">
            <label htmlFor="remark" className="ModalUpdateTracking-form-label">
              noted
            </label>
            <input
              className="ModalUpdateTracking-form-control"
              type="text"
              name="remark"
              onChange={handleChangeTracking}
              value={tracking.remark}
            />
          </div>
          <div className="ModalUpdateTracking-form-group">
            <label
              htmlFor="pic1File"
              className="ModalUpdateTracking-form-label"
            >
              pic1
            </label>
            {tracking.pic1_filename === "" ? (
              <>
                <input
                  className="ModalUpdateTracking-form-control"
                  accept="image/*"
                  type="file"
                  onChange={handleSelectPic1File}
                />
                {pic1File && (
                  <>
                    <div>
                      <img src={URL.createObjectURL(pic1File)} width="100px" />
                      <button onClick={removeSelectedPic1File}>X</button>
                    </div>
                    <button type="button" onClick={handleUploadPic1File}>
                      upload
                    </button>
                  </>
                )}
              </>
            ) : (
              <div>
                <img src={"/image/" + tracking.pic1_filename} width="100px" />
              </div>
            )}
          </div>
          <div className="ModalUpdateTracking-form-group">
            <label
              htmlFor="pic2File"
              className="ModalUpdateTracking-form-label"
            >
              pic2
            </label>

            {tracking.pic2_filename === "" ? (
              <>
                <input
                  className="ModalUpdateTracking-form-control"
                  accept="image/*"
                  type="file"
                  onChange={handleSelectPic2File}
                />
                {pic2File && (
                  <>
                    <div>
                      <img src={URL.createObjectURL(pic2File)} width="100px" />
                      <button onClick={removeSelectedPic2File}>X</button>
                    </div>
                    <button type="button" onClick={handleUploadPic2File}>
                      upload
                    </button>
                  </>
                )}
              </>
            ) : (
              <div>
                <img src={"/image/" + tracking.pic1_filename} width="100px" />
              </div>
            )}
          </div>
        </div>
        <div className="ModalUpdateTracking-footer">
          <button type="button" onClick={handleUpdateTracking}>
            Update
          </button>
          <button type="button" onClick={props.close}>
            Cancle
          </button>
        </div>
      </div>
    </div>
  );
}

let trackingModel = {
  date: "",
  username: "",
  track_id: "",
  weight: "",
  remark: "",
  round_boat: "",
  pic1_filename: "",
  pic2_filename: "",
  created_at: "",
  updated_at: "",
};
function packFile(file) {
  const fd = new FormData();
  fd.append("image", file, file.name);
  return fd;
}

export default ModalUpdateTracking;
