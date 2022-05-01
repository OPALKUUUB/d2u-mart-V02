import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
// import Tracking from "../../components/Tracking";
import TrackingV2 from "../../components/tracking/TrackingV2";
import UploadCsv from "../../components/UploadCsv";

export default function ShimizuTrackingV2() {
  const [modalShowAddCsv, setModalShowAddCsv] = useState(false);
  return (
    <>
      <div className="d-flex justify-content-end">
        <Button
          variant="warning"
          onClick={() => setModalShowAddCsv(true)}
          size="sm"
        >
          Upload CSV
        </Button>
      </div>
      <TrackingV2 mode="shimizu" header="Shimizu" />
      <UploadCsvModal
        show={modalShowAddCsv}
        onHide={() => setModalShowAddCsv(false)}
      />
    </>
  );
}

function UploadCsvModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      sm={12}
      y="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Upload CSV</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UploadCsv />
      </Modal.Body>
    </Modal>
  );
}
