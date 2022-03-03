(function ($) {
  $(function () {
    // window.shopUrl = "https://shizengzhen1.myfunpinpin.top";
    const shopUrl = window.shopUrl;
    if (!shopUrl) return;
    const hasConsent = localStorage.getItem("cookie_consent") === "true";
    if (hasConsent) return;
    function getColorStringFromRGBAObj(rgbaStr) {
      const obj = JSON.parse(rgbaStr);
      const { r, g, b, a } = obj;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    function create() {
      $.ajax({
        url: `https://cookie-bar-dev-cuwmnyhgmq-uc.a.run.app/client/cookie-bar?shop=${
          shopUrl.split("//")[1]
        }`,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
          console.log(data);
          const body = $("body");
          const {
            banner_background_color,
            banner_link_color,
            banner_text_color,
            button_background_color,
            button_border_color,
            button_text_color,
            enabled,
            info_link_text,
            message,
            ok_button_text,
            privacy_policy_url,
          } = data;

          if (!enabled) return;

          const wrap = $("<div></div>").css({
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 99999,
          });

          const container = $("<div></div>").css({
            backgroundColor: getColorStringFromRGBAObj(banner_background_color),
            minHeight: 60,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 16,
            padding: "16px 28px",
          });

          const leftPartLink = $("<a></a>")
            .text(info_link_text)
            .css({
              textDecoration: "underline",
              color: getColorStringFromRGBAObj(banner_link_color),
            })
            .attr("href", privacy_policy_url);
          const leftPart = $("<div></div>")
            .css({
              color: getColorStringFromRGBAObj(banner_text_color),
            })
            .text(message);

          function onCookieBarOk() {
            localStorage.setItem("cookie_consent", "true");
            wrap.remove();
          }
          const rightPart = $("<button></button>")
            .css({
              border: `2px solid ${getColorStringFromRGBAObj(
                button_border_color
              )}`,
              backgroundColor: getColorStringFromRGBAObj(
                button_background_color
              ),
              color: getColorStringFromRGBAObj(button_text_color),
              minWidth: "20%",
              textAlign: "center",
              lineHeight: "30px",
              cursor: "pointer",
              marginLeft: "10px",
            })
            .click(onCookieBarOk)
            .text(ok_button_text);

          $(leftPart).append(leftPartLink);
          $(container).append(leftPart);
          $(container).append(rightPart);
          $(wrap).append(container);
          body.append(wrap);
        },
      });
      // fetch(`https://616e-103-206-188-68.ngrok.io/cookie-bar?shop=${shopUrl.split("//")[1]}`,{
      //   method:'GET',
      //   mode:'cors',
      //   headers: { 'Content-Type': 'application/json' }
      // }).then((res)=>res.json()).then((res)=>{
      //
      //
      // })
    }
    create();
  });
})(window.$);
