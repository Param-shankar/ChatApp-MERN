import React from "react";

const Reciver = ({ msg }) => {
  return (
    <div
      style={{
        height: "10vh",
        fontFamily: "monospace",
        fontSize: "3vh",
        fontWeight: "400",
        padding: "10px",
        borderRadius: "3vh",
        margin: "1vh",
        display: "flex",
        fontFamily: "monospace",
        color: "white",
        minWidth: "5vw",
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "GrayText",
          height: "8vh",
          borderRadius: "2vh",
          wordWrap: "break-word",
          display: "flex",
          padding: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {msg}
      </div>
    </div>
  );
};

export default Reciver;
