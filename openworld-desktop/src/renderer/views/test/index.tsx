import React from "react";
import "./index.scss";
import {ipcSend} from "../../../utils/ipcSend";

export default function Test(): JSX.Element {
  return (
    <div className="mid">
      <div
        style={{
          cursor: "pointer",
          backgroundColor: "#C0C0C0",
          color: "#000",
          width: "200px",
          height: "32px",
        }}
        onClick={() => ipcSend("popup", "Hello!")}
      >
        Click me!
      </div>
    </div>
  );
}
