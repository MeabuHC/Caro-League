import React from "react";
import { Layout, Menu } from "antd";
import styles from "../styles/components/CustomSider.module.css";
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  MessageOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem(
    <Link to={"/"} style={{ color: "white" }}>
      Home
    </Link>,
    "0",
    <HomeOutlined style={{ color: "white" }} />
  ),
  getItem(
    <Link to={"/caro"} style={{ color: "white" }}>
      Caro
    </Link>,
    "2",
    <DesktopOutlined style={{ color: "white" }} />
  ),
  getItem(
    <Link to={"/chats"} style={{ color: "white" }}>
      Chats
    </Link>,
    "3",
    <MessageOutlined style={{ color: "white" }} />
  ),
  getItem(
    <span style={{ color: "white" }}>Friends</span>,
    "4",
    <TeamOutlined style={{ color: "white" }} />
  ),
];

const CustomSider = () => {
  const location = useLocation();
  const selectedKey = items.find(
    (item) => location.pathname === item.label.props?.to
  )?.key;

  return (
    <Sider width={195} className={styles.sider} defaultCollapsed={true}>
      <Menu items={items} selectedKeys={selectedKey ? [selectedKey] : []} />
    </Sider>
  );
};

export default CustomSider;
