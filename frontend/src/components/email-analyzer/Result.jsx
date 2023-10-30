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
      {/* General information card */}
      <GeneralInfo
        result={result["basic_info"]}
        hashes={result["eml_hashes"]}
      />

      {/* Basic security checks card */}
      <SecurityCheck result={result["warnings"]} />

      {/* Attachements card */}
      <Attachments result={result["attachments"]} />

      {/* URLs card */}
      <Urls result={result["urls"]} />

      {/* Hops card */}
      <Hops result={result["hops"]} />

      {/* Full header card */}
      <Header result={result["headers"]} />

      {/* Message text card */}
      <MessageBody result={result["message_text"]} />
    </>
  );
}
