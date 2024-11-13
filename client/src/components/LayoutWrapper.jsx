import React from "react";
import { Layout, Spin } from "antd";
import { Outlet } from "react-router-dom";
import CustomHeader from "./CustomHeader";
import CustomSider from "./CustomSider";

const { Content } = Layout;

// Basic layout: Header + Sidebar + Content
export default function LayoutWrapper() {
  return (
    <Layout
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CustomHeader />
      <Layout hasSider style={{ flexGrow: 1 }}>
        <CustomSider />
        <Content style={{ overflowY: "auto" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
