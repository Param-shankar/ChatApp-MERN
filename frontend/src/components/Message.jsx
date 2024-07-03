import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Sender from "./Sender";
import Reciver from "./Reciver";
import fetchdata from "../fetchdata";
import { useEffect } from "react";
import { Chatsuser } from "../context/ChatProvider";
import { Button, Form, Input, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import io from "socket.io-client";
var  socket;
// socket = io("http://localhost:3000");

const fetchmsg = async (chatid, setmsg, msg) => {
  var data = await fetchdata(`/api/message/fetchchat/${chatid}`);
  console.log("fethcmsg");
  data = data.reverse();
  setmsg(data);
};

const Message = () => {
  let { chatid } = useParams();
  const [id, setid] = useState("");
  const [msg, setmsg] = useState([]);
  const [typing, settyping] = useState(false);

  //importing the value form the context api
  const { un, setun, userobj } = useContext(Chatsuser);

  useEffect(() => {
    socket = io("http://localhost:3000");
  }, []);

  useEffect(() => {
    setid(chatid);
    fetchmsg(chatid, setmsg, msg);
    socket.emit("joinroom", [chatid, un]);
  }, [chatid]);

  useEffect(() => {
    socket.on('messageinroom', data => {
      setmsg([data, ...msg]);
    })
  })
  const [formdata] = useForm();
  // console.log(messageform);
  const onfinish = ({ message }) => {
    (async () => {
      const { data } = await axios.post("/api/message/send", {
        chatid: chatid,
        content: message,
      });
      formdata.resetFields();

      socket.emit("message", data);

      setmsg([data, ...msg]);
    })();
    // const {data} = await axios
    //   .post("/api/message/send", { chatid: chatid, content: message })
    //   .then((value) => {
    //     console.log(value);
    //     formdata.resetFields();
    //   });
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "whitesmoke",
          height: "80.5vh",
          width: "100%",
          display: "flex",
          overflow: "scroll",
          flexDirection: "column-reverse",
        }}
      >
        {msg?.map((val) => {
          if (val.sender.name == un) {
            return <Sender msg={val.content || null} />;
          } else {
            return <Reciver msg={val.content} />;
          }
        })}
      </div>
      <Space.Compact
        style={{
          height: "5vh",
          width: "100%",
        }}
      >
        <Form
          onFinish={onfinish}
          form={formdata}
          // encType="multipart/form-data"
          name="hok-tranfomr"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Form.Item
            name="message"
            style={{ width: "90%", marginRight: "1vw" }}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              send
            </Button>
          </Form.Item>
        </Form>
      </Space.Compact>
    </>
  );
};

export default Message;
