import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "../utils/firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import delay from "../utils/delay";

const baseUrl = import.meta.env.VITE_BASE_URL;

function AuthLoginGoogleButton({ setLoading, setMessages }) {
  const navigate = useNavigate();
  const { setRefetch } = useUserContext();

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Get the Firebase ID Token
    const idToken = await user.getIdToken();
    console.log(idToken);

    setLoading(true);
    try {
      const data = await axios.post(
        `${baseUrl}/loginGoogle`,
        { idToken }, // Send the token as part of an object
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      await delay(1000);
      setRefetch(true);
      navigate("/home");
    } catch (error) {
      console.log(error);

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
    <button onClick={googleLogin}>
      <img
        src="https://pro-theme.com/html/teamhost/assets/img/google.svg"
        alt="Google"
      />
    </button>
  );
}

export default AuthLoginGoogleButton;
