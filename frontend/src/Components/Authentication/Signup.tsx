import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import Notification from "../Utils/Notification";
import axios from "src/Utils/axiosConfig";
import { useAppDispatch } from "src/Redux/hooks";
import { setShowVerificationPage } from "src/Redux/auth";

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleOk = () => {
    setLoading(true);
  };

  const postData = async (values: any) => {
    try {
      const result = await axios.post("/api/signup", JSON.stringify(values), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      Notification("success", "Successfull", "Please check your Inbox for verification mail.");

      return result;
    } catch (error) {
      console.log(error); //donot remove (debugging purpose)
      Notification("error", "Error", error["response"]["data"]["msg"]);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    if (
      values.email.trim() === "" ||
      values.username.trim() === "" ||
      values.password.trim() === ""
    ) {
      onFinishFailed("Required fields empty");
      setLoading(false);
      return;
    }

    await postData(values);

    //TODO-Redirect to email verification
  };

  const onFinishFailed = (errorInfo: any) => {
    setLoading(false);
    Notification("warning", "Warning", "Please fill all the required fields");
    return;
  };

  return (
    <section>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="signup-form"
      >
        <Form.Item
          label="Email ID"
          name="email"
          rules={[{ required: true, message: "Please input your Email ID!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            className="signup-btn-modal"
            type="primary"
            htmlType="submit"
            loading={loading}
            onClick={handleOk}
          >
            Signup
          </Button>
        </Form.Item>
      </Form>

      {/* <div className="social-divider">
        <span className="or">or</span>
      </div>
      <div className="signup-options">
        <div id="google-auth-btn"></div>
      </div> */}
    </section>
  );
};

export default Signup;
