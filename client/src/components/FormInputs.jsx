import React from "react";
import styles from "../styles/components/FormInputs.module.css"; // Adjust the path as needed

const FormInputs = ({ inputs, formData, onChange }) => {
  return (
    <>
      {inputs.map((input) => (
        <input
          key={input.name}
          type={input.type}
          placeholder={input.placeholder}
          value={formData[input.name]}
          onChange={onChange}
          name={input.name}
          minLength={input.minLength}
          maxLength={input.maxLength}
          className={styles.inputField}
          readOnly={input.readOnly}
          required={input.required}
          autoComplete="current-password"
        />
      ))}
    </>
  );
};

export default FormInputs;
