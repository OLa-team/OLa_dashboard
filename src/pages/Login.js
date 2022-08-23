import React, { useState } from "react";
import small from "../../src/assets/small.png";
import logoWhite from "../../src/assets/logo-white.png";
import { Link } from "react-router-dom";
import { useAuthDispatch, useAuthState } from "../context";
import { loginUser } from "../service";
import ClipLoader from "react-spinners/ClipLoader";
import { sendEmail } from "../utils";

function Login() {
  // State
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [spamMessage, setSpamMessage] = useState("");
  const [color, setColor] = useState("");

  // Global state
  const dispatch = useAuthDispatch();
  const { loading } = useAuthState();

  async function handleLoginAndSendEmail(e) {
    e.preventDefault();

    // async request to the server
    try {
      let response = await loginUser(dispatch, email);
      if (response.length > 1) return;

      sendEmail(e);
      e.target.reset();
      setColor("rgb(46, 183, 46)");
      setMessage("Kindly check your email for the login link");
      setSpamMessage(
        "(*Please check your spam or junk mail folder if you did not receive any verification email.)"
      );
    } catch (error) {
      setColor("red");
      setMessage("Please enter a valid email");
      console.log("No such hcp email, login error: ", error);
    }
  }

  const override: CSSProperties = {
    marginLeft: "10px",
  };

  return (
    <div className="bg">
      <div className="login">
        <div className="topBar">
          <div className="leftTopBar">
            <img src={small} alt="small.png" />
            <h3>OLa</h3>
          </div>

          <div className="rightTopBar">
            <Link to="/register" className="toSignUp">
              Create an account
            </Link>
          </div>
        </div>

        <div className="loginContent">
          <div className="loginPart">
            <p>Welcome to</p>
            <h1>OLa</h1>
            <br />
            <p>Please enter your email to receive the login link</p>
            <form onSubmit={(e) => handleLoginAndSendEmail(e)}>
              <input
                type="text"
                placeholder="Email address"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ display: "inline" }}
              />
              <ClipLoader
                color="red"
                loading={loading}
                size={20}
                cssOverride={override}
              />
              <p style={{ color: color, paddingTop: "10px" }}>
                {loading ? "" : message}
              </p>
              <p style={{ color: color, paddingTop: "10px" }}>
                {loading ? "" : spamMessage}
              </p>
              <button type="submit">Login</button>
            </form>
          </div>

          <div className="logoPart">
            <img src={logoWhite} alt="logo-white.png" />
            <h2>Where patients matter most</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
