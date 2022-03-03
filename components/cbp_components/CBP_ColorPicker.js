import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { cbp_getColorStringFromRGBAObj } from "../cookiebar_plugin_utils";
import { transparent_image_base64 } from "../cbp_styles";

//代码参考自https://casesandberg.github.io/react-color/#examples
//UI样式：左边一个圆形，右边是提示文字。圆形内是选择的颜色，如果选择的是半透明色，会有灰白块。
//CBP是CookieBarPlugin的缩写
export function CBP_ColorPicker(props) {
  const [displayColorPicker, set_displayColorPicker] = useState(false);

  //当点击外面的入口圆形，点击后显示popover
  function handleClick() {
    set_displayColorPicker(!displayColorPicker);
  }

  //显示popover后，有一个背景层，点击背景层后关闭popover
  function handleClose() {
    set_displayColorPicker(false);
  }

  const colorCircleOuter = {
    borderRadius: "50%",
    overflow: "hidden",
    border: "1px solid #f0f0f0",
    background: `url("${transparent_image_base64}") repeat`,
  };
  const colorCircleInner = {
    width: 20,
    height: 20,
    borderRadius: "50%",
    backgroundColor: cbp_getColorStringFromRGBAObj(props.colorobj),
  };
  function onColorChange(colorResult) {
    const rgb = colorResult.rgb;
    props.onChange(props.config_key, JSON.stringify(rgb));
  }
  function renderPopover() {
    const popover = {
      position: "absolute",
      zIndex: "2",
    };
    const cover = {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    };
    if (displayColorPicker) {
      return (
        <div style={popover}>
          <div style={cover} onClick={handleClose} />
          <ChromePicker color={props.colorobj} onChange={onColorChange} />
        </div>
      );
    } else {
      return null;
    }
  }
  const nameStyle = {
    fontSize: 14,
    color: "#a4a4a4",
    marginLeft: 5,
  };
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    ...props.style,
  };
  return (
    <div style={containerStyle}>
      <div style={colorCircleOuter} onClick={handleClick}>
        <div style={colorCircleInner} />
      </div>
      <div style={nameStyle}>{props.name}</div>
      {renderPopover()}
    </div>
  );
}
