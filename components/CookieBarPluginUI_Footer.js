import React from "react";
import { Button } from "antd";

//Footer很简单，仅有一个保存按钮
export function CookieBarPluginUI_Footer(props) {
  const label = props.saving ? "正在保存..." : "保存";
  return (
    <div
      style={{
        borderTop: "1px solid #dcdfe6",
        textAlign: "right",
        fontSize: 0,
        padding: "20px 20px",
      }}
    >
      <Button type="primary" onClick={props.onSave} disabled={props.saving}>
        {label}
      </Button>
    </div>
  );
}
