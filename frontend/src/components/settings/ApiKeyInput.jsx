import React, { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { apiKeysState } from "../../App";
import api from "../../api";

import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FormGroup from "@mui/material/FormGroup";
import Link from "@mui/material/Link";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";

export default function ApiKeyInput(props) {
  const setApiKeys = useSetRecoilState(apiKeysState);
  const [serviceKey, setServiceKey] = useState("");

  useEffect(() => {
    if (!props.apiKeys[props.name]) {
      setServiceKey("");
    }
  }, [props.apiKeys, props.name]);

  const handleServiceKeyInput = (event) => {
    setServiceKey(event.target.value);
  };

  const updateApikeys = () => {
    api.get("/api/apikeys/is_active")
      .then((response) => {
        setApiKeys(response.data);
      })
      .catch((error) => console.log("Error updating API keys:", error));
  };

  const handleApiKey = (method, name, key) => {
    let url = `/api/apikeys`;
    let data = {};
    if (method === "delete") {
      url += `?name=${name}`;
    } else if (method === "post") {
      url += `/`;
      data = { name: name, key: key, is_active: true };
    }
    api({
      method: method,
      url: url,
      data: data
    })
      .then(() => {
        updateApikeys();
        if (method === "delete") {
          setServiceKey("");
        }
      })
      .catch((error) => console.log("Error processing API key:", error));
  };

  const deleteApiKey = (name) => {
    handleApiKey("delete", name, null);
  };

  const createApiKey = (key) => {
    if (key === "") {
      alert("Please enter a valid API key");
      return;
    }
    handleApiKey("post", props.name, key);
  };

  return (
    <FormGroup row>
      <TextField
        id={`${props.name}_textfield`}
        label={props.description}
        value={props.apiKeys[props.name] ? "**************" : serviceKey}
        type="password"
        onChange={handleServiceKeyInput}
        disabled={props.apiKeys[props.name]}
        variant="outlined"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {props.apiKeys[props.name] ? (
                <Tooltip title="Delete API Key">
                  <IconButton
                    color="error"
                    onClick={() => deleteApiKey(props.name)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <>
                  <Link
                    href={props.link}
                    underline="hover"
                    target="_blank"
                    rel="noopener"
                    sx={{mr: 5}}
                  >
                    {"Get API key"}
                  </Link>
                  <Tooltip title="Save API Key">
                    <IconButton
                      color="primary"
                      onClick={() => createApiKey(serviceKey)}
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </InputAdornment>
          )
        }}
        sx={{ m: 1 }}
      />
    </FormGroup>
  );
}
