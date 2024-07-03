import { useEffect, useState } from "react";
import fetchdata from "./fetchdata";
import { Link, NavLink, Outlet } from "react-router-dom";
import "../src/app.css"
import Typography from "antd/es/typography/Typography";
import { Button } from "antd";

function App() {
  // const [chats, setchats] = useState([]);

  // useEffect(() => {
  //   fetchdata("/api/chats").then((value) =>{ setchats(value)
  //      console.log(value)});
  // }, []);
  // console.log(chats);
  return (
    <div id="landing_page">
      <div id="continer">
        <div id="heading">
          <h1>MERN CHAT APP</h1>
        </div>
        <div id="link">
          <NavLink
            to="singup"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            <Button style={{ marginRight: "0.5rem" }}>Signup</Button>
          </NavLink>
          <NavLink
            to=""
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            <Button style={{ marginRight: "0.5rem" }}>login</Button>
          </NavLink>
        </div>
        <Outlet />
        {/* <Link to="chats">chats</Link> */}
      </div>
    </div>
  );
}

export default App;
