import React from "react";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import api from "../../api";

import { apiKeysState } from "../../App";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FormGroup from "@mui/material/FormGroup";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";


export default function ApiKeyInput(props) {
  const setApiKeys = useSetRecoilState(apiKeysState);

  function updateApikeys() {
    api
      .get("/api/apikeys/is_active")
      .then((response) => {
        const result = response.data;
        setApiKeys(result);
      });
  }

  const [serviceKey, setServiceKey] = useState("");
  const handleServiceKeyInput = (event) => {
    setServiceKey(event.target.value);
  };

  function handleApiKey(method, name, key) {
    let url = `/api/apikeys/`;
    let json = {};
    if (method === "delete") {
      url = `/api/apikeys?name=${name}`;
    } else {
      json = { name: name, key: key, is_active: true };
    }
    api[method](url, json)
      .then(() => updateApikeys())
      .catch((error) => console.log(error));
  }

  function deleteApiKey(name) {
    handleApiKey("delete", name, null);
    updateApikeys();
  }

  function createApiKey(key) {
    if (key === "") {
      alert("Please enter a valid API key");
      return;
    }
    handleApiKey("post", props.name, key);
    updateApikeys();
  }

  return (
    <>
      <FormGroup row>
        <Button
          variant="contained"
          color="primary"
          endIcon={<OpenInNewIcon />}
          disableElevation
          size="small"
          href={props.link}
          target="_blank"
        >
          Get API key
        </Button>
        <TextField
          id={props.name + "_textfield"}
          label={props.description}
          defaultValue={props.apiKeys[props.name] ? "**************" : ""}
          type="password"
          onChange={handleServiceKeyInput}
          disabled={props.apiKeys[props.name] ? true : false}
          variant="filled"
          size="small"
          sx={{ width: "50%" }}
        />
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="Disabled elevation buttons"
        >
          {props.apiKeys[props.name] ? (
            <Button
              variant="contained"
              color="error"
              disableElevation
              size="small"
              onClick={() => deleteApiKey(props.name)}
            >
              <DeleteForeverIcon />
            </Button>
          ) : null}
          {!props.apiKeys[props.name] ? (
            <Button
              variant="contained"
              color="success"
              disableElevation
              size="small"
              onClick={() => createApiKey(serviceKey)}
            >
              <SaveIcon />
            </Button>
          ) : null}
        </ButtonGroup>
      </FormGroup>
    </>
  );
}
