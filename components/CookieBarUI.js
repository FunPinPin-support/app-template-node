import React from "react";

function renderLeftPart(model) {
  const style = {
    color: model.get_banner_text_colorstr(),
  };
  const style_a = {
    color: model.get_banner_link_colorstr(),
    textDecoration: "underline",
  };
  return (
    <div style={style}>
      {model.get_message()}{" "}
      <a style={style_a} href={model.get_privacy_policy_url()}>
        {model.get_info_link_text()}
      </a>
    </div>
  );
}

function renderRightPart(model, onOk) {
  const style = {
    border: `2px solid ${model.get_button_border_colorstr()}`,
    backgroundColor: model.get_button_background_colorstr(),
    color: model.get_button_text_colorstr(),
    minWidth: "20%",
    textAlign: "center",
    lineHeight: "30px",
    cursor: "pointer",
    marginLeft: "10px",
  };
  return (
    <button style={style} onClick={onOk}>
      {model.get_ok_button_text()}
    </button>
  );
}
// CookieBarUI，C端上的就是这个样子
export function CookieBarUI(props) {
  const model = props.model;
  const style = {
    backgroundColor: model.get_banner_background_colorstr(),
    minHeight: 60,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 16,
    padding: "16px 28px",
  };
  return (
    <div style={style}>
      {renderLeftPart(model)}
      {renderRightPart(model, props.onOk)}
    </div>
  );
}
