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
import { useUserContext } from "../context/UserContext";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const CustomSider = () => {
  const { user } = useUserContext();
  const homeUrl = user ? "/home" : "/";

  const items = [
    getItem(
      <Link to={homeUrl} style={{ color: "white" }}>
        Home
      </Link>,
      "0",
      <HomeOutlined style={{ color: "white" }} />
    ),
    getItem(
      <Link to={"/play"} style={{ color: "white" }}>
        Caro
      </Link>,
      "2",
      <DesktopOutlined style={{ color: "white" }} />
    ),
    getItem(
      <Link to={`/chats`} style={{ color: "white" }}>
        Chats
      </Link>,
      "3",
      <MessageOutlined style={{ color: "white" }} />
    ),
  ];

  const location = useLocation();
  const selectedKey = items.find((item) => {
    return location.pathname.startsWith(item.label.props?.to);
  })?.key;

  return (
    <Sider width={195} className={styles.sider} defaultCollapsed={true}>
      <Menu items={items} selectedKeys={selectedKey ? [selectedKey] : []} />
    </Sider>
  );
};

export default CustomSider;
