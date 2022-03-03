import React from "react";
import { transparent_image_base64 } from "./cbp_styles";

//预览画布
export function CookieBarPluginUI_PreviewCanvas(props) {
  //模拟photoshop画布
  const style_canvas_div = {
    background: `url("${transparent_image_base64}") repeat`,
    height: "245px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
    margin: 20,
    overflow: "hidden",
    resize: "horizontal",
  };
  const style_container = {
    flex: 1, //flex-grow:1时，宽度是自动计算的，不能和resize同时使用，同时使用则resize不生效
  };
  return (
    <div style={style_container}>
      <div style={style_canvas_div}>{props.children}</div>
    </div>
  );
}
