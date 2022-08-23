import React, { useEffect, useState } from "react";
import logoRed from "../../src/assets/logo-red.png";
import { BsPersonFill } from "react-icons/bs";
import { FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import { registerHcp } from "../service";

function Register() {
  // State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [hcps, setHcps] = useState([]);
  const [message, setMessage] = useState("");

  // db collection
  const hcpsCollectionRef = collection(firestore, "hcp");

  // navigate
  const navigate = useNavigate();

  function signUp(e) {
    e.preventDefault();
    setMessage("");
    console.log("Signing in");

    // Check valid email
    if (!isValidEmail(email)) {
      setMessage("The email is not valid.");
      return;
    }

    const repeatedHcpUsername = hcps.filter((hcp) => hcp.username === username);
    const repeatedHcpEmail = hcps.filter((hcp) => hcp.email === email);
    if (repeatedHcpUsername.length > 0) {
      setMessage("The name is existed");
      return;
    }

    if (repeatedHcpEmail.length > 0) {
      setMessage("The email is existed");
      return;
    }

    registerHcp(email, username);
    alert("Sign up successfully");
    navigate("/login");

    e.target.reset();
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const getHcps = async () => {
    const data = await getDocs(hcpsCollectionRef);
    setHcps(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    getHcps();
  }, []);

  return (
    <div className="bgRegister">
      <div className="register">
        <div className="registerPart">
          <div className="top">
            <img src={logoRed} alt="logoRed.png" />
            <h2>Create an account</h2>
          </div>
          <form onSubmit={(e) => signUp(e)}>
            <div className="registrationInput">
              <i className="fa fa-user icon">
                <BsPersonFill />
              </i>
              <input
                type="text"
                className="input-field"
                placeholder="Full name"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="registrationInput">
              <i className="fa fa-envelope icon">
                <FaEnvelope />
              </i>
              <input
                type="text"
                className="input-field"
                placeholder="Email address"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <p style={{ color: "red" }}>{message}</p>

            <button className="signUpBtn">Sign Up</button>
          </form>

          <p>
            Already have an account? {"  "}
            <Link to="/login" className="toSignIn">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
