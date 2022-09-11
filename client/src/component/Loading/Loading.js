import React from "react";
import ReactLoading from "react-loading";

const Loading = ({
  type = "spinningBubbles",
  color,
  height = "7%",
  width = "7%",
  show,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: "999",
        background: "rgba(0,0,0,0.4)",
        display: show ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ReactLoading type={type} color={color} height={height} width={width} />
    </div>
  );
};

export default Loading;
