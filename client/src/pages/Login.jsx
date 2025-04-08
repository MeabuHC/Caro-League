import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthButtonList from "../components/AuthButtonList";
import AuthForm from "../components/AuthForm";
import OrWithEmail from "../components/OrWithEmail";
import styles from "../styles/pages/Login.module.css";
import delay from "../utils/delay";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import AuthLoginGoogleButton from "../components/AuthLoginGoogleButton";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser, setRefetch } = useUserContext();
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  //Navigate to home if user already login
  useEffect(() => {
    if (user) {
      navigate("/home");
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
      setRefetch(true);
      navigate("/home");
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
          <AuthButtonList>
            <AuthLoginGoogleButton
              setLoading={setLoading}
              setMessages={setMessages}
            />
          </AuthButtonList>
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
