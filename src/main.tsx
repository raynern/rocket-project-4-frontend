import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/root.js";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/error-page.js";
import LoginRegister from "./routes/loginregister.js";
import Onboard from "./routes/onboard.js";
import Portal from "./routes/portal.js";
import Home from "./routes/days.js";
import Insights from "./routes/insights.js";
import CreateInsight from "./routes/createinsight.js";
import EditInsight from "./routes/editinsight.js";
import CreateDay from "./routes/createday.js";
import EditDay from "./routes/editday.js";
import Days from "./routes/days.js";
import Analysis from "./routes/analysis.js";

import { Auth0Provider } from "@auth0/auth0-react";

const router = createBrowserRouter([
  {
    index: true,
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/welcome",
    element: <LoginRegister />,
  },
  {
    path: "/",
    element: <Portal />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/days",
        element: <Days />,
      },

      {
        path: "/days/create",
        element: <CreateDay />,
      },
      {
        path: "/days/:dayId",
        element: <EditDay />,
      },
      {
        path: "/insights",
        element: <Insights />,
      },
      {
        path: "/insights/create",
        element: <CreateInsight />,
      },
      {
        path: "/insights/:insightId",
        element: <EditInsight />,
      },
      {
        path: "/analysis",
        element: <Analysis />,
      },
    ],
  },
  {
    path: "/onboard",
    element: <Onboard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-eodtdkvh7j57mfe5.us.auth0.com"
      clientId="RZNM0KOZ3y84qTovXEDYOplBpYPKDN5C"
      authorizationParams={{
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        audience: "mantraminder-backend-api",
      }}
    >
      <RouterProvider router={router} />
    </Auth0Provider>
  </React.StrictMode>
);
