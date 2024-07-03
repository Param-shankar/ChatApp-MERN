import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import axios from "axios";
import { useForm } from "antd/es/form/Form";

const props = {
  name: "file",
};


const Signup = () => {
  const [form_signup] = useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
    console.log(values);
    console.log(values.file.file);
    const formdata = new FormData();
    formdata.append("file", values?.file.file);
    formdata.append("name", values.name);
    formdata.append("password", values.password);
    formdata.append("email", values.email);
    axios.post("/api/newuser", formdata).then((value) => {
      console.log(value);
    });
    form_signup.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div id="fromlogin">
      <Form
        encType="multipart/form-data"
        form={form_signup}
        name="basic"
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
        preserve={false}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

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
          label="Confirm Password"
          name="password1"
          rules={[
            {
              required: true,
              message: "re-enter your password",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="file" label="Photo">
          <Upload
            {...props}
            accept=".png, .svg, .jpeg"
            beforeUpload={() => false}
          >
            <Button>Click to Upload</Button>
          </Upload>
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

export default Signup;
