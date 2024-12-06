import React, { useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function UserHome() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Hello");
    if (!user) navigate("/", { replace: true });
  }, []);

  //UI flashy purpose
  if (!user) return <div>Hello</div>;
  else return <div>UserHome</div>;
}

export default UserHome;
