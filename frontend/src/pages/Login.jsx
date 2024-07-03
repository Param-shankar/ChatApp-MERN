import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import "../app.css";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
import { redirect, useNavigate } from "react-router-dom";
import { message } from "antd";

export const Login = () => {
  const navigate = useNavigate();

  const [form] = useForm();

  const onFinish = async (values) => {
    console.log("Success:", values);
    const datavl = await axios
      .post("/api/login", {
        Userdata: values,
      })
      .then(({ data }) => {
        console.log(data);
        if (data?.match) {
          navigate("/chats");
        } else {
          console.log("not found");
        }
      })
      .catch((error) => {
        console.log(error);
        message.error("Incrrect email-id or password");
        console.log("not found");
      });
    console.log("para", datavl);
    form.resetFields();
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div id="fromlogin">
      <Form
        form={form}
        name="basic"
        reser
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
