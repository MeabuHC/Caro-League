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
  getItem(<Link to={"/"}>Home</Link>, "0", <HomeOutlined />),
  getItem(<Link to={"/profile"}>Profile</Link>, "1", <UserOutlined />),
  getItem(<Link to={"/caro"}>Caro</Link>, "2", <DesktopOutlined />),
  getItem(<Link to={"/chats"}>Chats</Link>, "3", <MessageOutlined />),
  getItem("Friends", "4", <TeamOutlined />),
];

const CustomSider = () => {
  const location = useLocation();
  const selectedKey = items.find(
    (item) => location.pathname === item.label.props?.to
  )?.key;

  return (
    <Sider
      width={195}
      className={styles.sider}
      collapsible
      collapsedWidth={70}
      defaultCollapsed={false}
    >
      <Menu items={items} selectedKeys={selectedKey ? [selectedKey] : []} />
    </Sider>
  );
};

export default CustomSider;
