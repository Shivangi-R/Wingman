import { Button, Checkbox, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import Notification from "../Utils/Notification";
import axios from "src/Utils/axiosConfig";
import { useAppSelector, useAppDispatch } from "src/Redux/hooks";
import { setIsLoggedIn, setToken, setCurrentUser } from "src/Redux/auth";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleOk = () => {
    setLoading(true);
  };

  const postData = async (values: any) => {
    const result = await axios.post("/api/signin", JSON.stringify(values), {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return result.data;
  };

  const onFinish = async (values: any) => {
    if (values.email.trim() === "" || values.password.trim() === "") {
      onFinishFailed("Required fields empty");
      setLoading(false);
      return;
    }

    try {
      const result = await postData(values);
      dispatch(
        setCurrentUser({ username: result.username, email: result.email })
      );
      dispatch(setToken(result.token));
   

      Notification("success", "Sucessfull", "Logged in successfully");
    } catch (error) {
      console.log(error); //donot remove (debugging purpose)
      Notification("error", "Error", error["response"]["data"]["msg"]);
    } finally {
      setLoading(false);
    }
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
        className="login-form"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
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

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            className="login-btn-modal"
            type="primary"
            htmlType="submit"
            loading={loading}
            onClick={handleOk}
          >
            Login
          </Button>
        </Form.Item>
      </Form>

      {/* <div className="social-divider">
        <span className="or">or</span>
      </div> */}
      {/* <div className="signup-options"> */}
      {/* <Button type="primary">
          <span className="button-text">Continue with Google</span>
          <span className="button-icon"></span>
        </Button>/ */}
      {/* <div id="google-auth-btn"></div> */}
      {/* </div> */}
    </section>
  );
};

export default Login;
