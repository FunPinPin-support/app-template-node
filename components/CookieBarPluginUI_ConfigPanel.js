import React from "react";
import { CBP_TitleWithMaxLength } from "./cbp_components/CBP_TitleWithMaxLength";
import { cbp_intro_style, cbp_title_style } from "./cbp_styles";
import { CBP_ColorPicker } from "./cbp_components/CBP_ColorPicker";
import { cbp_assert } from "./cookiebar_plugin_utils";
import _ from "lodash";

//ConfigPanel最顶部是提醒区域
function renderTipArea(title, intro) {
  const style = {
    title: { ...cbp_title_style, fontSize: "18px" },
    intro: {
      ...cbp_intro_style,
    },
    hr: {
      border: "none",
      borderTop: `1px solid #ccc`,
      height: 0,
      marginBottom: 0,
      marginTop: 10,
      width: "100%",
    },
  };

  return (
    <div>
      <div className="title" style={style.title}>
        {title}
      </div>
      <div className="intro" style={style.intro}>
        {intro}
      </div>
      <hr />
    </div>
  );
}

function render6ColorPickers(model, onChange) {
  const cellStyle = {
    minHeight: 40,
    minWidth: "49%",
  };
  //prettier-ignore
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap'
    }}>
      <CBP_ColorPicker onChange={onChange} config_key={'banner_background_color'} colorobj={model.get_banner_background_colorobj()}  name={'Banner'} style={cellStyle} />
      <CBP_ColorPicker onChange={onChange} config_key={'banner_text_color'} colorobj={model.get_banner_text_colorobj()}  name={'Banner Text'} style={cellStyle} />
      <CBP_ColorPicker onChange={onChange} config_key={'banner_link_color'} colorobj={model.get_banner_link_colorobj()}  name={'Banner Link'} style={cellStyle} />
      <CBP_ColorPicker onChange={onChange} config_key={'button_background_color'} colorobj={model.get_button_background_colorobj()}  name={'Button'} style={cellStyle} />
      <CBP_ColorPicker onChange={onChange} config_key={'button_text_color'} colorobj={model.get_button_text_colorobj()}  name={'Button Text'} style={cellStyle} />
      <CBP_ColorPicker onChange={onChange} config_key={'button_border_color'} colorobj={model.get_button_border_colorobj()}  name={'Button Border'} style={cellStyle} />
    </div>
  );
}

const CookieBarPluginUIStyle = {
  textarea: {
    width: "100%",
    border: "1px solid #e3e8ec",
    padding: 5,
  },
  input: {
    width: "100%",
    border: "1px solid #e3e8ec",
    padding: 5,
  },
  CBP_TitleWithMaxLength: {
    marginTop: "20px",
  },
  card: {
    padding: 10,
    margin: 10,
    boxShadow:
      "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    backgroundColor: "white",
    borderRadius: 4,
  },
};

//配置面板
export function CookieBarPluginUI_ConfigPanel(props) {
  const model = props.model;

  function onInputChange(e) {
    const target = e.target;
    const name = target.name; //name就是数据库中的key
    cbp_assert(_.isString(name), "name must be string");
    props.onChange(name, target.value);
  }
  /* prettier-ignore */
  return (
    <div style={{width:'400px'}}>
      <div className="card">
        {renderTipArea('Banner Settings','Make the banner seamlessly suit your store')}
        {/*这里的“字符”指的是UTF-16 code units，一个emoji是2个UTF-16。但用户可能认为emoji是一个字符，但在程序中，emoji、汉字、英文字母都叫做glyph*/}
        <CBP_TitleWithMaxLength title={'Message'} currentCount={model.get_message().length} maxLength={300} unit={'字符'} className={'CBP_TitleWithMaxLength'} />
        <textarea style={CookieBarPluginUIStyle.textarea} maxLength={300} name="message" value={model.get_message()} onChange={onInputChange} rows={3} />

        <CBP_TitleWithMaxLength title={'Privacy Policy URL'} currentCount={model.get_privacy_policy_url().length} maxLength={1000} unit={'字符'}  className={'CBP_TitleWithMaxLength'}/>
        <input style={CookieBarPluginUIStyle.input} type="text" maxLength={1000} name={'privacy_policy_url'} value={model.get_privacy_policy_url()} onChange={onInputChange} />

        <CBP_TitleWithMaxLength title={'OK Button Text'} currentCount={model.get_ok_button_text().length} maxLength={30} unit={'字符'}  className={'CBP_TitleWithMaxLength'}/>
        <input style={CookieBarPluginUIStyle.input} type="text" maxLength={30} name={'ok_button_text'} value={model.get_ok_button_text()} onChange={onInputChange} />

        <CBP_TitleWithMaxLength title={'Info Link Text'} currentCount={model.get_info_link_text().length} maxLength={30} unit={'字符'}  className={'CBP_TitleWithMaxLength'}/>
        <input style={CookieBarPluginUIStyle.input} type="text" maxLength={30} name={'info_link_text'} value={model.get_info_link_text()} onChange={onInputChange} />
        <div style={{height:40}} />
      </div>
      <div className="card" style={CookieBarPluginUIStyle.card}>
        {renderTipArea('Design Settings', 'Change the design of you banner')}
        {render6ColorPickers(model, props.onChange)}
      </div>
    </div>
  );
}
