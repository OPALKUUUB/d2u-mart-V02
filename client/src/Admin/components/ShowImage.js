import React from "react";
import { Modal } from "react-bootstrap";

export default function ShowImage(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onClick={props.onHide}
    >
      <img src={props.src} />
    </Modal>
  );
}
