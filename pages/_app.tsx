import App, {AppProps} from "next/app";

import "antd/dist/antd.css";
import "../assets/base.css";

function MyProvider(props: any) {
  const Component = props.Component;

  return <Component {...props} />;
}

function MyApp({Component, pageProps}: AppProps) {
  return <MyProvider Component={Component} {...pageProps} />;
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
  };
};

export default MyApp;
