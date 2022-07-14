import React, { useEffect, useState } from "react";
import { Button, Card, Spin } from "antd";
import { IS_EMBEDDED_APP } from "../../config";
import { useAppBridge } from "fpp-app-bridge-react";
import { getSessionToken } from "fpp-app-bridge-utils";
import { get } from "client/api";

const Test: React.FC<{}> = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const app = IS_EMBEDDED_APP ? useAppBridge() : null;
  const getProductCounts = async () => {
    setLoading(true);
    const token = IS_EMBEDDED_APP ? await getSessionToken(app) : "";
    const data: any = await get({
      url: "/products-count",
      data: {},
      headers: { Authorization: `Bearer ${token}` },
      app,
    });
    setCount(data.products);
    setLoading(false);
  };
  useEffect(() => {
    getProductCounts();
  }, []);
  return (
    <Card title="Products Counter">
      <p>
        Sample products are created with a default title and price. You can
        remove them at any time.
      </p>
      <h4>TOTAL PRODUCTS</h4>
      <h2>{loading ? <Spin></Spin> : count}</h2>
      <Button type="primary" onClick={getProductCounts}>
        Refresh Count
      </Button>
    </Card>
  );
};

export default Test;
