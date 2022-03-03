import React from "react";
import { CookieBarPluginUI } from "./CookieBarPluginUI";
import { CookieBarPluginConfigFetcher } from "./CookieBarPluginConfigFetcher";
import { Spin } from "antd";
import _ from "lodash";

//CookieBarPlugin 包含完整功能
export function CookieBarPlugin() {
  function renderChildren(fetcher_state) {
    if (_.isString(fetcher_state.errmsg)) {
      return (
        <div>
          error occurred:
          <br />
          <pre>{fetcher_state.errmsg}</pre>
        </div>
      );
    } else if (fetcher_state.model === null) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            display: "flex",
            top: 0,
            left: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin spinning={true} />
        </div>
      );
    } else {
      return (
        <CookieBarPluginUI
          model={fetcher_state.model}
          saving={fetcher_state.saving}
          onChange={fetcher_state.onChange}
          onSave={fetcher_state.onSave}
        />
      );
    }
  }
  return (
    <CookieBarPluginConfigFetcher>
      {renderChildren}
    </CookieBarPluginConfigFetcher>
  );
}
