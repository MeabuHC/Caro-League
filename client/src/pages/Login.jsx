import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocialLinks from "../components/SocialLinks";
import AuthForm from "../components/AuthForm";
import OrWithEmail from "../components/OrWithEmail";
import styles from "../styles/pages/Login.module.css";
import delay from "../utils/delay";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  //Navigate to home if user already login
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  // Define state for messages
  const [messages, setMessages] = useState({
    error: "",
    success: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const socialLinks = [
    {
      href: "https://www.google.com/",
      imgSrc: "https://pro-theme.com/html/teamhost/assets/img/google.svg",
      altText: "Google",
    },
    {
      href: "https://www.facebook.com/",
      imgSrc: "https://pro-theme.com/html/teamhost/assets/img/facebook.svg",
      altText: "Facebook",
    },
    {
      href: "https://twitter.com/",
      imgSrc: "https://pro-theme.com/html/teamhost/assets/img/twitter.svg",
      altText: "Twitter",
    },
  ];

  const inputConfigurations = [
    {
      type: "email",
      placeholder: "Email",
      name: "email",
      required: true,
    },
    {
      type: "password",
      placeholder: "Password",
      name: "password",
      maxLength: 20,
      required: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const data = await axios.post(`${baseUrl}/login`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      // If success

      await delay(1000);
      setUser(data.data.data.user);
      navigate("/");
    } catch (error) {
      // If fail
      setMessages({
        error:
          error.response?.data?.message || "Network error. Please try again.",
        success: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.left}></div>
      <div className={styles.right}>
        <div className={styles.login_form}>
          <SocialLinks links={socialLinks} />
          <OrWithEmail />
          <AuthForm
            inputConfigurations={inputConfigurations}
            type="login"
            onSubmit={handleSubmit}
            messages={messages} // Pass combined messages
            formData={formData}
            setFormData={setFormData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
