import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

export const ShowImage = ({ src, width = 100 }) => {
  const [modal, setModal] = useState(false);
  return (
    <>
      <img src={src} alt={src} width={width} onClick={() => setModal(true)} />
      <ImageModal show={modal} onHide={() => setModal(false)} src={src} />
    </>
  );
};

const ImageModal = (props) => {
  return (
    <Modal {...props}>
      <img src={props.src} alt={props.src} />
    </Modal>
  );
};
