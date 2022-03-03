import React, { useState, useEffect } from "react";
// import {
//   shopSettingCookieBarPlugin,
//   shopSettingCookieBarPluginCreate,
//   shopSettingCookieBarPluginUpdate
// } from '@src/api/apps';
import { CookieBarPluginModel } from "./CookieBarPluginModel";
import { camelObjFromObj } from "./cookiebar_plugin_utils";
import _ from "lodash";

// CookieBarPluginConfigFetcher 负责获取数据、保存数据，然后给children提供数据（props）
export function CookieBarPluginConfigFetcher(props) {
  const [fetching, setFetching] = useState(false); //正在查询
  const [saving, setSaving] = useState(false); //正在保存
  //model的状态：先尝试从server获取，如果获取不到使用defaultModel。；修改配置后，model是基础model+用户改动；保存后，服务端保存的内容等于本地内容
  const [model, setModel] = useState(null);
  const [errmsg, setErrmsg] = useState(null); //如果为string，表示出现了error

  async function fetch_cookiebar_config() {
    setFetching(true);
    try {
      const res = await fetch("/cookie-bar", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log(">>>>", res);
      const data = res ? await res.json() : {};
      if (data?.id) {
        const m = new CookieBarPluginModel(data);
        setModel(m);
      } else {
        setModel(CookieBarPluginModel.defaultModel());
      }
    } catch (e) {
      setErrmsg(e.toString());
    } finally {
      setFetching(false);
    }

    // if (res.data.cookieBar) {
    // }
    return CookieBarPluginModel.defaultModel();
  }

  useEffect(() => {
    fetch_cookiebar_config().then();
  }, []);

  function onChange(config_key, value) {
    const snake_obj = model.get_cloned_snake_obj();
    snake_obj[config_key] = value;
    const camelObj = camelObjFromObj(snake_obj);
    const model_after = new CookieBarPluginModel(camelObj);
    setModel(model_after);
  }

  //用户点击了保存按钮
  async function onSave(model) {
    setSaving(true);
    console.log(model.get_id());
    if (model.get_id() === null /*create*/) {
      const res = await fetch("/cookie-bar", {
        method: "POST",
        body: JSON.stringify(model.get_cloned_snake_obj()),
        headers: { "Content-Type": "application/json" },
      });
      fetch_cookiebar_config().then();
    } else {
      console.log(11321321);
      const res = await fetch("/cookie-bar", {
        method: "PUT",
        body: JSON.stringify(model.get_cloned_snake_obj()),
        headers: { "Content-Type": "application/json" },
      });
      //id已存在，执行update
      //await shopSettingCookieBarPluginUpdate(model.get_id(), model.get_mutation_input()); //并不会返回最新值，所以只能重新获取一次
      fetch_cookiebar_config().then();
    }

    setSaving(false);
  }

  const fetcher_state = {
    fetching,
    saving,
    model,
    errmsg,
    onChange,
    onSave,
  };
  return props.children(fetcher_state);
}
