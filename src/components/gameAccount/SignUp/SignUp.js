/* eslint-disable react-hooks/exhaustive-deps */
import { Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; 
import Input from "../Input/Input";
import Button from "../Button/Button"; 
import { useAuth } from "../../../functions/AuthDetails";
import classes from "./SignUp.module.css";

function SingUp() {
  const {
    isAuthenticated,
    login: LoginGlobal,
    code,
    loginError,
    setLoginValues,
  } = useAuth();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [disabled, setDisabled] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  const login = () => {
    LoginGlobal(username, password);
  };

  async function verifyEmailValidationCode() {
    await Auth.confirmSignUp(username, verifyCode)
      .then(() => {
        login();
      })
      .catch((e) => {
        console.log("failed with error", e);
      });
  }

  const signup = () => {
    Auth.signUp({
      username,
      password,
    })
      .then((user) => {
        login();
      })
      .catch((err) => {
        setLoginValues((prev) => {
          return {
            ...prev,
            loginError: err?.message,
          };
        });
      });
  };

  useEffect(() => {
    if (username && password) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [username, password]);

  useEffect(() => {
    if (loginError) {
      setLoginValues((prev) => {
        return {
          ...prev,
          loginError: null,
        };
      });
    }
  }, [username, password]);

  if (isAuthenticated) {
    return <Navigate to="/account" state={{ fromLogin: true }} />;
  }

  if (code === "UserNotConfirmedException") {
    return (
      <div className={classes.container}>
        <Input
          style={{
            marginBottom: 24,
          }}
          placeHolder="Verify"
          value={verifyCode}
          onChange={setVerifyCode}
        />

        <Button
          disabled={disabled}
          style={{ margin: "auto" }}
          onPress={verifyEmailValidationCode}
          title={"Verify"}
        />
      </div>
    );
  }
  return (
    <div className={classes.container}>
      <Input
        placeHolder="Email"
        value={username}
        onChange={setUserName}
        inputType="email"

      />
      <Input
        inputType="password"
        placeHolder="Password"
        value={password}
        onChange={setPassword}
      />
      <Input
        inputType="password"
        placeHolder="Confirm Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
      />
      <Button
        disabled={disabled}
        style={{ margin: "auto" }}
        onPress={signup}
        title={"Create account"}
      />
    </div>
  );
}

export default SingUp;
