import React, { useState } from "react";
import "./ModalAddTracking.css";

function ModalAddTracking(props) {
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
  const handleAddTracking = () => {
    console.log(tracking);
    fetch("/api/admin/tracking", {
      method: "POST",
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
    <div className="ModalAddTracking-layout">
      <div className="ModalAddTracking-container">
        <div className="ModalAddTracking-header">
          <h3>Add Tracking</h3>
        </div>
        <div className="ModalAddTracking-body">
          <div className="ModalAddTracking-form-group">
            <label htmlFor="date" className="ModalAddTracking-form-label">
              date
            </label>
            <input
              className="ModalAddTracking-form-control"
              type="date"
              name="date"
              onChange={handleChangeTracking}
            />
          </div>
          <div className="ModalAddTracking-form-group">
            <label htmlFor="username" className="ModalAddTracking-form-label">
              username
            </label>
            <input
              className="ModalAddTracking-form-control"
              type="text"
              name="username"
              onChange={handleChangeTracking}
            />
          </div>
          <div className="ModalAddTracking-form-group">
            <label htmlFor="track_id" className="ModalAddTracking-form-label">
              track_id
            </label>
            <input
              className="ModalAddTracking-form-control"
              type="text"
              name="track_id"
              onChange={handleChangeTracking}
            />
          </div>
          <div className="ModalAddTracking-form-group">
            <label htmlFor="weight" className="ModalAddTracking-form-label">
              weight
            </label>
            <input
              className="ModalAddTracking-form-control"
              type="number"
              name="weight"
              onChange={handleChangeTracking}
            />
          </div>
          <div className="ModalAddTracking-form-group">
            <label htmlFor="noted" className="ModalAddTracking-form-label">
              noted
            </label>
            <input
              className="ModalAddTracking-form-control"
              type="text"
              name="noted"
              onChange={handleChangeTracking}
            />
          </div>
          <div className="ModalAddTracking-form-group">
            <label htmlFor="round_boat" className="ModalAddTracking-form-label">
              round_boat
            </label>
            <input
              className="ModalAddTracking-form-control"
              type="date"
              name="round_boat"
              onChange={handleChangeTracking}
            />
          </div>
          <div className="ModalAddTracking-form-group">
            <label htmlFor="pic2File" className="ModalAddTracking-form-label">
              pic1
            </label>
            <input
              className="ModalAddTracking-form-control"
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
          </div>
          <div className="ModalAddTracking-form-group">
            <label htmlFor="pic2File" className="ModalAddTracking-form-label">
              pic2
            </label>

            <input
              className="ModalAddTracking-form-control"
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
          </div>
        </div>
        <div className="ModalAddTracking-footer">
          <button type="button" onClick={handleAddTracking}>
            Add
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
  noted: "",
  round_boat: "",
  pic1_filename: "",
  pic2_filename: "",
};
function packFile(file) {
  const fd = new FormData();
  fd.append("image", file, file.name);
  return fd;
}

export default ModalAddTracking;
