import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ReactLoading from "react-loading";
export default function UploadCsv() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleChangeCsvFile = (e) => {
    setLoading(true);
    const file = e.target.files[0];

    let f = new FormData();
    f.append("file", file);
    fetch("/api/admin/read/csv", {
      method: "POST",
      body: f,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json.data);
        setData(json.data);
        setLoading(false);
      });
  };

  const handleAdd = () => {
    setLoading(true);
    fetch("/api/admin/csv/shimizu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: data }),
    })
      .then((res) => res.json())
      .then((json) => {
        setLoading(false);
        alert("Add table successfully!");
        window.location.reload(false);
      });
  };

  return (
    <>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Default file input example</Form.Label>
        <Form.Control
          type="file"
          accept=".csv"
          onChange={handleChangeCsvFile}
        />
      </Form.Group>
      <DataTable pagination highlightOnHover columns={columns} data={data} />
      <Button onClick={handleAdd}>Add</Button>
      {loading && (
        <>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              background: "rgba(0,0,0,0.3)",
              width: "100vw",
              height: "100vh",
              zIndex: "9999",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <ReactLoading
                type={"bubbles"}
                color={"rgba(0,0,0,0.2)"}
                height={400}
                width={300}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

const columns = [
  {
    name: "date",
    selector: (row) => row.date,
  },
  {
    name: "username",
    selector: (row) => row.username,
  },
  {
    name: "track_id",
    selector: (row) => row.track_id,
  },
  {
    name: "box_id",
    selector: (row) => row.box_id,
  },
  {
    name: "weight",
    selector: (row) => row.weight,
  },
  {
    name: "round_boat",
    selector: (row) => row.round_boat,
  },
  {
    name: "remark",
    selector: (row) => row.remark,
  },
];
