/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../../functions/AuthDetails";
import { getErrorMessage } from "../../../functions/Helpers";
import { CREATE_PLAYER } from "./PlayerCreation.schema";
import LoginCard from "../LoginCard/LoginCard";
import LoginWrapper from "../LoginWrapper/LoginWrapper";
import Input from "../Input/Input";
import Button from "../Button/Button";
import ErrorAlert from "../ErrorAlert/ErrorAlert";
import classes from "./PlayerCreation.module.css";
import { useNavigate } from "react-router-dom";

function PlayerCreation() {
  const { getUpdatedUser } = useAuth();

  const [onCreatePlayer, { loading }] = useMutation(CREATE_PLAYER);
  const [createError, setCreateError] = useState("");

  const [creationState, setCreationState] = useState({
    displayName: "",
    password: "",
  });

  const setPassword = (val) => {
    setCreationState((prev) => ({
      ...prev,
      password: val,
    }));
  };
  const setDisplayName = (val) => {
    const input = val;
    const validInput = /^[a-zA-Z0-9]+$/.test(input);

    if (validInput) {
      setCreationState((prev) => ({
        ...prev,
        displayName: val,
      }));
    } else if (!validInput) {
      setCreateError("Username can only contain letters and numbers.");
    }
  };

  const { displayName, password } = creationState;
  const navigate = useNavigate();

  const _onCreatePlayer = async () => {
    try {
      await onCreatePlayer({
        variables: {
          displayName: displayName,
          password: password,
        },
      });
      getUpdatedUser();
      setTimeout(() => {
        navigate("/account");
      }, 1000);
    } catch (error) {
      setCreateError(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (createError) {
      setCreateError("");
    }
  }, [creationState]);

  return (
    <LoginWrapper style={{ margin: "6rem 0rem" }}>
      <LoginCard>
        <div className={classes.container}>
          <h4 className={classes.playerCreationTitle}>Player Creation</h4>
          <form autocomplete="off" className={`p-0 ${classes.container}`}>
            <Input
              autocomplete="off"
              name="displayName"
              
              placeHolder="Display name"
              value={displayName}
              onChange={setDisplayName}
            />
            <Input
              name="player-password"
               
              inputType="password"
              placeHolder="Password"
              value={password}
              onChange={setPassword}
            />
            <Button 
              onPress={_onCreatePlayer}
              title={"Continue"}
              loading={loading}
            />
          </form>
        </div>
      </LoginCard>
      <ErrorAlert error={createError} />
    </LoginWrapper>
  );
}

export default PlayerCreation;
