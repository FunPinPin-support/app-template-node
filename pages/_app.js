import App from "next/app";

import "antd/dist/antd.css";
import "../assets/base.css";

function MyProvider(props) {
  const Component = props.Component;

  return <Component {...props} />;
}

class MyApp extends App {
  render() {
    const { Component, pageProps, host } = this.props;
    return <MyProvider Component={Component} {...pageProps} />;
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
  };
};

export default MyApp;
