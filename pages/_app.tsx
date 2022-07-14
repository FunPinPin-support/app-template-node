import 'regenerator-runtime/runtime'
import App, { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import { Provider } from "fpp-app-bridge-react";
import { IS_EMBEDDED_APP } from "../config";
import zhCN from "antd/lib/locale/zh_CN";
import "../assets/base.css";
import "antd/dist/antd.less";
import "../assets/antd.cover.less";

function MyProvider(props: any) {
  const Component = props.Component;

  return <Component {...props} />;
}

interface IAppProps extends AppProps {
  host: string;
  apiKey: string;
}

function MyApp({ Component, pageProps, host, apiKey }: IAppProps) {
  return (
    <ConfigProvider locale={zhCN}>
      {IS_EMBEDDED_APP ? (
        <Provider
          config={{
            apiKey: apiKey,
            host: host,
            forceRedirect: true,
          }}
        >
          <MyProvider Component={Component} {...pageProps} />
        </Provider>
      ) : (
        <MyProvider Component={Component} {...pageProps} />
      )}
    </ConfigProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
    apiKey: process.env.FPP_API_KEY,
  };
};

export default MyApp;
