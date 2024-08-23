import "../App.css";
import { Outlet } from "react-router-dom";
import NavBar from "../assets/components/NavBar";
import Footer from "../assets/components/Footer";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

import { terminal } from "virtual:terminal";

function Portal() {
  // const { loginWithRedirect, isAuthenticated } = useAuth0();
  // terminal.log("auth state is: ", isAuthenticated);

  // if (!isAuthenticated) {
  //   terminal.log("not authenticated");
  //   loginWithRedirect();
  //   return <>hi</>;
  // }
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
