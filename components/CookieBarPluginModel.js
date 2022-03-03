import {
  cbp_getColorStringFromRGBAObj,
  snakeObjFromObj,
} from "./cookiebar_plugin_utils";
import _ from "lodash";

function cbp_assert(value, msg = "") {
  if (!value) throw Error(msg || "assert error");
}

export class CookieBarPluginModel {
  orig_obj;
  snake_obj;
  constructor(obj) {
    this.orig_obj = obj;
    this.snake_obj = snakeObjFromObj(obj);
    for (const key of _.keys(this.snake_obj)) {
      if (key.includes("color")) {
        const value = this.snake_obj[key];
        cbp_assert(_.isObject(JSON.parse(value)), `${key} must be object!`);
      }
    }
    console.log(">>", obj, this.snake_obj);
  }

  static defaultModel() {
    const default_domain = window.localStorage.getItem("default_domain");
    const domain_part = default_domain || window.location.origin;

    const defaultObj = {
      id: null,
      message:
        "This website uses cookies to ensure you get the best experience on our website.",
      privacyPolicyUrl: `${domain_part}`,
      okButtonText: "Got it!",
      infoLinkText: "Learn More",
      enabled: false,
      bannerBackgroundColor: JSON.stringify({ r: 0, g: 0, b: 0, a: 1 }),
      bannerTextColor: JSON.stringify({ r: 255, g: 255, b: 255, a: 1 }),
      bannerLinkColor: JSON.stringify({ r: 255, g: 255, b: 255, a: 1 }),

      buttonBackgroundColor: JSON.stringify({ r: 0, g: 0, b: 0, a: 0 }),
      buttonTextColor: JSON.stringify({ r: 246, g: 230, b: 42, a: 1 }),
      buttonBorderColor: JSON.stringify({ r: 246, g: 230, b: 42, a: 1 }),
    };
    return new CookieBarPluginModel(defaultObj);
  }

  get_message() {
    return this.snake_obj.message;
  }

  get_privacy_policy_url() {
    return this.snake_obj.privacy_policy_url;
  }

  get_ok_button_text() {
    return this.snake_obj.ok_button_text;
  }

  get_info_link_text() {
    return this.snake_obj.info_link_text;
  }

  get_enabled() {
    return this.snake_obj.enabled;
  }

  get_banner_background_colorstr() {
    return cbp_getColorStringFromRGBAObj(this.get_banner_background_colorobj());
  }
  get_banner_link_colorstr() {
    return cbp_getColorStringFromRGBAObj(this.get_banner_link_colorobj());
  }
  get_banner_text_colorstr() {
    return cbp_getColorStringFromRGBAObj(this.get_banner_text_colorobj());
  }
  get_button_text_colorstr() {
    return cbp_getColorStringFromRGBAObj(this.get_button_text_colorobj());
  }
  get_button_background_colorstr() {
    return cbp_getColorStringFromRGBAObj(this.get_button_background_colorobj());
  }
  get_button_border_colorstr() {
    return cbp_getColorStringFromRGBAObj(this.get_button_border_colorobj());
  }

  get_banner_background_colorobj() {
    return JSON.parse(this.snake_obj.banner_background_color);
  }
  get_banner_link_colorobj() {
    return JSON.parse(this.snake_obj.banner_link_color);
  }
  get_banner_text_colorobj() {
    return JSON.parse(this.snake_obj.banner_text_color);
  }
  get_button_text_colorobj() {
    return JSON.parse(this.snake_obj.button_text_color);
  }
  get_button_background_colorobj() {
    return JSON.parse(this.snake_obj.button_background_color);
  }
  get_button_border_colorobj() {
    return JSON.parse(this.snake_obj.button_border_color);
  }
  //返回的是拷贝版本，即使使用者把obj改了，我内部的obj不受影响
  get_cloned_snake_obj() {
    return { ...this.snake_obj };
  }

  get_mutation_input() {
    const orig_obj = { ...this.orig_obj };
    delete orig_obj.id;
    return orig_obj;
  }

  get_id() {
    return this.orig_obj.id;
  }
}
