import React from "react";

import Attachments from "./Attachments";
import GeneralInfo from "./GeneralInfo";
import Header from "./Header.jsx";
import Hops from "./Hops.jsx";
import MessageBody from "./MessageBody";
import SecurityCheck from "./SecurityCheck";
import Urls from "./Urls";

export default function Result(props) {
  const result = props.result;

  return (
    <>
      <GeneralInfo
        result={result["basic_info"]}
        hashes={result["eml_hashes"]}
      />

      <SecurityCheck result={result["warnings"]} />

      <Attachments result={result["attachments"]} />

      <Urls result={result["urls"]} />

      <Hops result={result["hops"]} />

      <Header result={result["headers"]} />

      <MessageBody result={result["message_text"]} />
    </>
  );
}
