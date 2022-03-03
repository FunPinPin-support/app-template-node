import React, { useState } from "react";

import { CookieBarPluginModel } from "./CookieBarPluginModel";
import { CookieBarPluginUI_PreviewCanvas } from "./CookieBarPluginUI_PreviewCanvas";
import { CookieBarPluginUI_ConfigPanel } from "./CookieBarPluginUI_ConfigPanel";
import { CookieBarUI } from "./CookieBarUI";
import { CookieBarPluginUI_BackHeader } from "./CookieBarPluginUI_BackHeader";
import { CookieBarPluginUI_Footer } from "./CookieBarPluginUI_Footer";
import { message, Modal } from "antd";
import { camelObjFromObj } from "./cookiebar_plugin_utils";

// CookieBarPluginUI 只控制外观，不保存状态
export function CookieBarPluginUI(props) {
  const [modal_visible, set_modal_visible] = useState(false);
  const model = props.model;
  const container_style = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px 50px",
  };

  function onModalOk() {
    set_modal_visible(false);
    const snake_obj = model.get_cloned_snake_obj();
    snake_obj.enabled = !model.get_enabled();
    const camelObj = camelObjFromObj(snake_obj);
    const model_after = new CookieBarPluginModel(camelObj);
    props.onSave(model_after);
    const action = model.get_enabled() ? "关闭 Cookie Bar" : "开启 Cookie Bar";
    message.success(action + "成功");
  }

  function onFooterSave() {
    props.onSave(model);
    message.success("保存成功");
  }

  return (
    <>
      <CookieBarPluginUI_BackHeader
        enabled={model.get_enabled()}
        onToggle={() => set_modal_visible(true)}
      />
      <div style={container_style}>
        <CookieBarPluginUI_ConfigPanel
          model={model}
          onChange={props.onChange}
        />
        <CookieBarPluginUI_PreviewCanvas>
          <CookieBarUI
            model={model}
            onOk={() => {
              console.log("Got it!");
            }}
          />
        </CookieBarPluginUI_PreviewCanvas>
      </div>
      <CookieBarPluginUI_Footer onSave={onFooterSave} saving={props.saving} />
      <Modal
        title={
          model.get_enabled()
            ? "要关闭 Cookie Bar 吗？"
            : "要开启 Cookie Bar 吗？"
        }
        visible={modal_visible}
        onCancel={() => set_modal_visible(false)}
        onOk={onModalOk}
      >
        {model.get_enabled()
          ? "关闭后，用户任何时候都不会看到 Cookie Bar"
          : "开启后，用户第一次进入网站时，在网页底部会看到 Cookie Bar"}
      </Modal>
    </>
  );
}
