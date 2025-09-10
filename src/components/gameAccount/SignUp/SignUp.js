/* eslint-disable react-hooks/exhaustive-deps */
import { Auth } from "aws-amplify";
import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useAuth } from "../../../functions/AuthDetails";
import classes from "./SignUp.module.css";
import ReCaptchaV2 from "react-google-recaptcha";

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
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef(null);

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

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
    if (!captchaValue) {
      window.alertify.error("Please verify the reCAPTCHA");
    } else {
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
    }
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
        disabled={disabled || !captchaValue}
        style={{ margin: "auto" }}
        onPress={signup}
        title={"Create account"}
      />
      <ReCaptchaV2
        sitekey="6LfFVMQrAAAAAGauKrn5cyQZRaXHMMlHMUz9IOnu"
        style={{ display: "inline-block" }}
        theme="dark"
        ref={recaptchaRef}
        onChange={handleCaptchaChange}
      />
    </div>
  );
}

export default SingUp;
