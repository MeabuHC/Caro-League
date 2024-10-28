import React from "react";
import { Layout, Spin } from "antd";
import { Outlet } from "react-router-dom";
import CustomHeader from "./CustomHeader";
import CustomSider from "./CustomSider";

const { Content } = Layout;

// Basic layout: Header + Sidebar + Content
export default function LayoutWrapper() {
  return (
    <Layout style={{ maxHeight: "100vh", overflowY: "hidden" }}>
      <CustomHeader />
      <Layout hasSider={true}>
        <CustomSider />
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
