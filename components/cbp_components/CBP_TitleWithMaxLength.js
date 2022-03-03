import React from "react";
import { cbp_title_style } from "../cbp_styles";

const styleObj = {
  title: {
    ...cbp_title_style,
    fontSize: "14px",
  },
  titlenums: {
    color: "#909399",
    fontSize: "12px",
    marginTop: 4,
  },
};

//CBP是CookieBarPlugin的缩写
//左边是title，右边是提示当前字数
export function CBP_TitleWithMaxLength(props) {
  return (
    <div
      style={{
        ...props.style,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
      className={props.className}
    >
      <div className="title" style={styleObj.title}>
        {props.title}
      </div>
      <div className="titlenums" style={styleObj.titlenums}>
        {props.currentCount}/{props.maxLength}
        {props.unit}
      </div>
    </div>
  );
}
