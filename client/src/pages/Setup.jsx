import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import styles from "../styles/pages/Setup.module.css";
import FormMessage from "../components/FormMessage";
import delay from "../utils/delay";
import axios from "axios";

const Setup = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = useParams().token;

  const [messages, setMessages] = useState({
    error: "",
    success: "",
  });

  const [formData, setFormData] = useState({
    token: token,
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [isVerified, setIsVerified] = useState(false); // Track verification status

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Send the token in the request body
        const { data } = await axios.post(
          `${baseUrl}/verify-email`, // Update the endpoint
          { token }, // Include the token in the body
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setFormData((prev) => ({
          ...prev,
          email: data.data,
        }));
        setIsVerified(true);
      } catch (error) {
        setMessages({
          error:
            error.response?.data?.message || "Network error. Please try again.",
          success: "",
        });
      }
    };
    verifyEmail();
  }, []);

  const inputConfigurations = [
    {
      type: "email",
      placeholder: "Email",
      name: "email",
      readOnly: true,
      required: true,
    },
    {
      type: "text",
      placeholder: "Username",
      name: "username",
      required: true,
    },
    {
      type: "password",
      placeholder: "Password",
      name: "password",
      minLength: 6,
      required: true,
    },
    {
      type: "password",
      placeholder: "Confirm Password",
      name: "confirmPassword",
      minLength: 6,
      required: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages({});
    await delay(1000);

    if (formData.password !== formData.confirmPassword) {
      setMessages({ error: "Passwords do not match.", success: "" });
      return;
    }

    try {
      const { data } = await axios.post(`${baseUrl}/setup`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      //If success
      setMessages({
        error: "",
        success: data.message,
      });
    } catch (error) {
      //If fail
      setMessages({
        error:
          error.response?.data?.message || "Network error. Please try again.",
        success: "",
      });
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.setup_container}>
        {messages.error && !isVerified ? (
          <FormMessage type="error" message={messages.error}></FormMessage>
        ) : (
          <AuthForm
            inputConfigurations={inputConfigurations}
            type="setup"
            onSubmit={handleSubmit}
            messages={messages}
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </div>
    </div>
  );
};

export default Setup;
