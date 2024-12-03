import { useState, useEffect } from "react";
import styles from "../styles/components/LoadingSpin.module.css"; // Adjust the import path

function LoadingSpin() {
  const [character, setCharacter] = useState("O");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCharacter((prevCharacter) => (prevCharacter === "O" ? "X" : "O"));
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return <div className={styles.spin_container}>{character}</div>;
}

export default LoadingSpin;
