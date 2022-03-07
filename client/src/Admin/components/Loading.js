import React from "react";
import ReactLoading from "react-loading";

export default function Loading(props) {
  if (props.load === 1) {
    return (
      <>
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
      </>
    );
  } else {
    return (
      <>
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            background: "rgba(0,0,0,0.3)",
            width: "100vw",
            height: "100vh",
            zIndex: "999",
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
    );
  }
}
