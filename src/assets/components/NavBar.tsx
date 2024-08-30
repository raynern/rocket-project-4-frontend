import { Link } from "react-router-dom";

import { TiLeaf } from "react-icons/ti";

import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./Profile";

export default function NavBar() {
  const { logout } = useAuth0();
  return (
    <>
      <div className="navbar box-border min-h-10 fixed z-10 bg-base-100 justify-between shadow-sm">
        <div className="ml-2 flex-1 space-x-5">
          <Link
            to="/days"
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <div className="flex flex-row items-center">
              <TiLeaf size="2.5em" className="mr-2" />
              <p className="hidden sm:block text-xl font-semibold">
                MantraMinder
              </p>
            </div>
          </Link>
        </div>
        <div className="">
          <ul className="space-x-2 menu menu-horizontal px-1 flex flex-row items-center">
            <li>
              <details>
                <summary id="submenu">Tools</summary>
                <ul
                  onClick={() => {
                    document.getElementById("submenu").click();
                  }}
                  className="bg-base-100 rounded-t-none p-2 space-y-2 z-10"
                >
                  <li>
                    <Link to="/days">
                      <p className="text-primary-content">Days</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/insights">
                      <p className="text-primary-content">Insights</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/analysis">
                      <p className="text-primary-content">Analysis</p>
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
            <div className="divider divider-horizontal" />
            <Profile></Profile>
            <li>
              <p
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
                className="text-base-300"
              >
                Log out
              </p>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
