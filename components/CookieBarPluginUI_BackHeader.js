import React from "react";
import { Button } from "antd";

const style = {
  tag: {
    borderRadius: "100px",
    fontSize: "13px",
    background: "#dfe3e8",
    border: "2px solid #fff",
    color: "#454f5b",
    padding: "2px 10px",
  },
  tagBgcOpen: {
    border: "2px solid #fff",
    background: "#bbe5b3",
    color: "#414f3e",
  },
  tagHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 50px 0 50px",
  },
};

export function CookieBarPluginUI_BackHeader(props) {
  return (
    <div style={style.tagHeader}>
      <div
        style={
          props.enabled ? { ...style.tagBgcOpen, ...style.tag } : style.tag
        }
      >
        {props.enabled ? "已开启" : "已关闭"}
      </div>
      <Button onClick={props.onToggle} type="primary">
        {props.enabled ? "关闭" : "开启"}
      </Button>
    </div>
  );
}
