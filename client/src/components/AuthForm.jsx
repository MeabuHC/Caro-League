import React, { useState } from "react";
import FormMessage from "./FormMessage";
import FormInputs from "./FormInputs";
import AuthSubmitButton from "./AuthSubmitButton";
import styles from "../styles/components/AuthForm.module.css";

const AuthForm = ({
  type,
  inputConfigurations,
  onSubmit,
  messages,
  formData,
  setFormData,
  loading = false,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <FormInputs
        inputs={inputConfigurations}
        formData={formData}
        onChange={handleChange}
      />

      {/* Error message display */}
      {messages.error && (
        <FormMessage
          type="error"
          message={messages.error}
          className={styles.errorMessage}
        />
      )}

      {/* Success message display */}
      {messages.success && (
        <FormMessage
          type="success"
          message={messages.success}
          className={styles.successMessage}
        />
      )}

      {/* Use the new AuthSubmitButton component */}
      <AuthSubmitButton type={type} loading={loading} />
    </form>
  );
};

export default AuthForm;
