import 'regenerator-runtime/runtime'
import React from "react";
import ProductCount from "@components/ProductCount"
import {Card, Col, Row } from 'antd';

const Index = () => (
  <Row style={{padding: "10px 0", background: "transparent"}} gutter={40}>
    <Col span={14}>
      <Card title="Congratulations 🎉">
          <p>You have successfully getting start.</p>
      </Card>
    </Col>
    <Col span={8}>
      <ProductCount />
    </Col>
  </Row>
);

export default Index;
