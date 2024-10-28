import React, { useState } from "react";
import SocialLinks from "../components/SocialLinks";
import AuthForm from "../components/AuthForm";
import OrWithEmail from "../components/OrWithEmail";
import styles from "../styles/pages/Signup.module.css"; // Adjust path if needed
import delay from "../utils/delay";
import axios from "axios";

const Signup = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [loading, setLoading] = useState(false);

  // Define state for messages
  const [messages, setMessages] = useState({
    error: "",
    success: "",
  });

  const [formData, setFormData] = useState({
    email: "",
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
  ];

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessages({}); // Reset messages

    setLoading(true);
    try {
      const { data } = await axios.post(`${baseUrl}/signup`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      setMessages({
        error: "",
        success: "A verification email has been sent. Please check your inbox.",
      });
    } catch (error) {
      console.log("This is error");
      console.log(error);
      setMessages({
        error:
          error.response?.data?.message ||
          error.response?.data ||
          "Network error. Please try again.",
        success: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.signup_container}>
        <SocialLinks links={socialLinks} />
        <OrWithEmail />
        <AuthForm
          inputConfigurations={inputConfigurations}
          type="signup"
          onSubmit={handleSubmit}
          messages={messages}
          formData={formData}
          setFormData={setFormData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Signup;
