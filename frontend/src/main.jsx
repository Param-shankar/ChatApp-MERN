import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { Chats } from "./pages/Chats.jsx";
const Signup = lazy(() => import("./pages/Signup.jsx"));
import fetchdata from "./fetchdata.js";
import Message from "./components/Message.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Login />} />
        <Route
          path="singup"
          element={
            <Suspense>
              {" "}
              <Signup />
            </Suspense>
          }
        />
      </Route>
      <Route
        path="/chats"
        element={<Chats />}
        loader={async () => {
          return await fetchdata("/api/chats/fetchchats");
        }}
      >
        <Route path=":chatid" element={<Message  />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
