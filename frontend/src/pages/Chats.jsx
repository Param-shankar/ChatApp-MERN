import React, { useEffect, useState } from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  HomeOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, theme, Badge, Space, Alert } from "antd";
import fetchdata from "../fetchdata";
import { NavLink, Navigate, Outlet, useLoaderData } from "react-router-dom";
import axios from "axios";
const { Header, Content, Footer, Sider } = Layout;
import { notification } from "antd";
import "./chat.css";
import { Chatsuser } from "../context/ChatProvider";

export const Chats = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const chats_api = useLoaderData();

  const username = chats_api.username;

  const [un, setun] = useState(username);
  const [userobj, setuserobj] = useState(chats_api.user);

  if (!chats_api.verification) {
    <Alert message="login in please" type="error" />;
    return <Navigate to="/" replace={true} />;
  } else {
    // setlogginuser(username);
  }

  const handlelogout = () => {
    axios.post("/api/logout", {
      logout: true,
    });
    console.log("clicked");
  };
  return (
    <Chatsuser.Provider value={{ un, setun , userobj}}>
      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            padding: "10vh 0.25vw 0 0.25vw ",
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["2"]}>
            {chats_api?.chats?.map(
              ({ isGroupChat, users, _id, chatname, username }, index) =>
                isGroupChat ? (
                  <NavLink to={`/chats/${_id}`}>
                    <Space
                      key={String(index + 1)}
                      size={"middle"}
                      style={{
                        width: "100%",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                      align="center"
                      onClick={() => console.log(index + 1)}
                    >
                      <Badge dot>
                        <Avatar.Group
                          key={String(index + 1)}
                          maxCount={2}
                          size={"medium"}
                          maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                          }}
                        >
                          {users.map(() => (
                            <Avatar
                              shape="circle"
                              icon={<UserOutlined />}
                              size={"medium"}
                              style={{
                                backgroundColor: "whitesmoke",
                                color: "black",
                              }}
                            />
                          ))}
                        </Avatar.Group>
                      </Badge>
                      <h5>{chatname}</h5>
                    </Space>
                  </NavLink>
                ) : (
                  <NavLink
                    to={`/chats/${_id}`}
                    className={({ isActive }) =>
                      isActive ? "activelink" : "inactive"
                    }
                  >
                    <Space
                      key={String(index + 1)}
                      size={"middle"}
                      style={{
                        width: "100%",
                        padding: "10px",
                        display: "flex",
                        marginRight: "30vw",
                        flexDirection: "row",
                        justifyContent: "center",
                        borderRadius: "1vh",
                        color: "white",
                      }}
                      align="center"
                      className="spac"
                      onClick={() => console.log(index + 1)}
                    >
                      <Avatar
                        shape="circle"
                        icon={<UserOutlined />}
                        size={"medium"}
                        style={{
                          backgroundColor: "whitesmoke",
                          color: "black",
                        }}
                      />
                      {/* <h5 style={{ backgroundColor: "white" }}>
                        {users.map(({ name }) => {})}
                      </h5> */}
                      {users.map(({ name }) => {
                        if (name == un) {
                          return null;
                        } else {
                          return <h5>{name}</h5>;
                        }
                      })}
                    </Space>
                  </NavLink>
                )
            )}
            <NavLink to={"/"}>
              <Space
                key={String(1)}
                size={"middle"}
                style={{
                  position: "absolute",
                  bottom:0, 
                  width: "100%",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
                align="center"
                onClick={handlelogout}
              >
                <Avatar
                  shape="circle"
                  icon={<HomeOutlined />}
                  size={"medium"}
                  style={{ backgroundColor: "whitesmoke", color: "black" }}
                />
                <h5 style={{ backgroundColor: "white" }}>Logout</h5>
              </Space>
            </NavLink>
          </Menu>
        </Sider>

        <Layout
          style={{
            // backgroundColor:"black",
            marginLeft: 200,
          }}
        >
          <Header
            style={{
              padding: 0,
              height: "5vh",
              background: colorBgContainer,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent:"center"
            }}
          >
            <h1>{username}</h1>
          </Header>

          <Content
            style={{
              margin: "24px 16px 0",
              overflow: "initial",
            }}
          >
            <Outlet />
          </Content>
          <Footer
            style={{
              height:"5vh",
              textAlign: "center",
            }}
          >
            PARAM SHANKAR © 2024
          </Footer>
        </Layout>
      </Layout>
    </Chatsuser.Provider>
  );
};
