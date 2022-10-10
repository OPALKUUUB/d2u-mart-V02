import React from "react";

function Facebook({ width = "72", height = "72" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 550 550"
      xmlSpace="preserve"
      width={width}
      height={height}
    >
      <circle cx="275" cy="275" r="256" fill="#3F65A6"></circle>
      <path
        fill="#FFF"
        d="M236.1 190.8v40.4h-29.6v49.4h29.6V416h60.8V280.5h40.8s3.8-23.7 5.7-49.6h-46.2v-33.8c0-5 6.6-11.8 13.2-11.8h33.1v-51.4h-45c-63.9.1-62.4 49.5-62.4 56.9z"
      ></path>
    </svg>
  );
}

export default Facebook;
