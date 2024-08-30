import "../App.css";
import landing_image from "../assets/landing_image.webp";
import { TiLeaf } from "react-icons/ti";

import { useAuth0 } from "@auth0/auth0-react";

function Root() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <>
      <div className="hero bg-base-200 h-screen">
        <div className="hero-content text-center">
          <div className=" flex flex-col items-center">
            <img
              // className="rounded-2xl w-1/3 shadow-xl mb-20"
              className="mask mask-squircle w-36 sm:w-48 shadow-xl mb-20"
              src={landing_image}
            ></img>
            <div className="flex flex-row items-center">
              <TiLeaf size="3em" className="mr-2" />
              <h1 className="text-3xl  sm:text-5xl font-bold">MantraMinder</h1>
            </div>

            <div className="mt-12 text-center font-medium italic	">
              <span className="block sm:inline">Capture Wisdom,</span>
              <span className="block sm:inline"> Cultivate Growth</span>
            </div>
            {/* <p className="py-6">Capture Wisdom, Cultivate Growth</p> */}

            <button
              onClick={() => loginWithRedirect()}
              className="btn btn-primary mt-20"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Root;
