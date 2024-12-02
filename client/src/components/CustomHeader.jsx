// CustomHeader.js
import React from "react";
import { Layout, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/components/CustomHeader.module.css";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
const { Header } = Layout;
const baseUrl = import.meta.env.VITE_BASE_URL;

const CustomHeader = () => {
  const { user, setUser, socket, setSocket } = useUserContext();
  const navigate = useNavigate();

  //Handle logout button
  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}/logout`, {}, { withCredentials: true });
      setUser(null);
      socket.disconnect();
      setSocket(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const items = [
    {
      label: <Link to={`/profile/${user?.username}`}>Profile</Link>,
      key: "1",
    },
    {
      label: <Link to={"/settings"}>Settings</Link>,
      key: "2",
    },
    {
      type: "divider",
    },
    {
      label: <Link onClick={handleLogout}>Logout</Link>,
      key: "3",
    },
  ];

  return (
    <Header className={styles.header}>
      <div className={styles.left}>
        <Link to={"/"}>
          {/* <img
            src="https://pro-theme.com/html/teamhost/assets/img/logo.png"
            alt="Logo"
          /> */}
          <span className="text-white">CAROLEAGUE</span>
        </Link>
      </div>
      <div className={styles.right}>
        {/* If user logged in */}
        {user ? (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            className={styles.dropdown}
          >
            <Link onClick={(e) => e.preventDefault()}>
              <img
                src={`${user.avatarUrl}`}
                className={styles.avatar}
                alt="Avatar"
              />
              {user.username}
              <DownOutlined />
            </Link>
          </Dropdown>
        ) : (
          <div className={styles.buttons}>
            <Link to="/login">
              <Button type="primary" className={styles.loginButton}>
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button type="default" className={styles.signupButton}>
                Signup
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Header>
  );
};

export default CustomHeader;
