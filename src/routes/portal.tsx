import "../App.css";
import { Outlet } from "react-router-dom";
import NavBar from "../assets/components/NavBar";
import Footer from "../assets/components/Footer";
import { withAuthenticationRequired } from "@auth0/auth0-react";

function Portal() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <NavBar></NavBar>
        <Outlet />
        <Footer></Footer>
      </div>
    </>
  );
}

export default withAuthenticationRequired(Portal);
