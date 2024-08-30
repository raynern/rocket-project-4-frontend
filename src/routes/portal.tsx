import "../App.css";
import { Outlet } from "react-router-dom";
import NavBar from "../assets/components/NavBar";
import Footer from "../assets/components/Footer";
import { withAuthenticationRequired } from "@auth0/auth0-react";

function Portal() {
  return (
    <>
      <div className="bg-base-200">
        <NavBar></NavBar>
        <div className="h-screen  pt-16">
          <Outlet />
        </div>

        <Footer></Footer>
      </div>
    </>
  );
}

export default withAuthenticationRequired(Portal);
