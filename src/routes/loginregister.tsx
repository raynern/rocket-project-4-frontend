import "../App.css";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function LoginRegister() {
  const { loginWithRedirect } = useAuth0();
  return (
    <>
      <div className="bg-base-200 min-h-screen flex flex-col justify-center items-center">
        <p>Login and Register</p>
        <button
          onClick={() => loginWithRedirect()}
          className="btn btn-primary mt-5"
        >
          Login
        </button>
        <button className="btn btn-secondary mt-5">Sign up</button>
      </div>
    </>
  );
}

export default LoginRegister;
