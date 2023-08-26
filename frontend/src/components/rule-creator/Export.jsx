import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import yaml from "js-yaml";
import { Alert, Button, Grid } from "@mui/material";

import {
  GeneralInfoAtom,
  AuthorAtom,
  TagsAtom,
  FieldsAtom,
  FalsepositivesAtom,
  ReferencesAtom,
  LogsourceAtom,
  RuleIdAtom,
  ConditionAtom,
  SelectionKeywordsAtom,
  TimeframeAtom,
  SelectionStatementAtom,
  FilterStatementAtom,
} from "./SigmaAtom";

import DownloadIcon from "@mui/icons-material/Download";

export default function Export() {
  const generalInfo = useRecoilValue(GeneralInfoAtom);
  const author = useRecoilValue(AuthorAtom);
  const authorString = author.join(", ");
  const tags = useRecoilValue(TagsAtom);
  const fields = useRecoilValue(FieldsAtom);
  const fps = useRecoilValue(FalsepositivesAtom);
  const references = useRecoilValue(ReferencesAtom);
  const logsrc = useRecoilValue(LogsourceAtom);
  const ruleId = useRecoilValue(RuleIdAtom);
  const condition = useRecoilValue(ConditionAtom);
  const selectionKeywords = useRecoilValue(SelectionKeywordsAtom);
  const timeframe = useRecoilValue(TimeframeAtom);
  const selectionStatement = useRecoilValue(SelectionStatementAtom);
  const filterStatement = useRecoilValue(FilterStatementAtom);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const processedSelection = selectionStatement.reduce((acc, item) => {
    const [key, value] = Object.entries(item)[0];
    const arrValue = [].concat(value);
    acc[key] = arrValue.length === 1 ? arrValue[0] : arrValue;
    return acc;
  }, {});

  const processedFilters = filterStatement.reduce((acc, item) => {
    const [key, value] = Object.entries(item)[0];
    const arrValue = [].concat(value);
    acc[key] = arrValue.length === 1 ? arrValue[0] : arrValue;
    return acc;
  }, {});

  const mandatoryFieldsPresent = () => {
    let missingFields = [];

    if (!generalInfo.title) missingFields.push("Title");
    if (!logsrc.product && !logsrc.service && !logsrc.category)
      missingFields.push("Log Source (Product, Service, or Category)");
    if (selectionStatement.length === 0 && selectionKeywords.length === 0)
      missingFields.push("Selection Statement or Keywords");

    if (missingFields.length > 0) {
      setAlertMessage(
        `Some mandatory values are missing: ${missingFields.join(
          ", "
        )}. Please provide the required values before exporting.`
      );
      return false;
    }
    return true;
  };

  const handleGenerateYaml = () => {
    if (!mandatoryFieldsPresent()) {
      setShowAlert(true);
      return;
    }
    const yamlData = {
      title: generalInfo.title === "" ? "Unnamed" : generalInfo.title,
      id: ruleId,
      related: "" || undefined,
      status: generalInfo.status || undefined,
      description: generalInfo.description || undefined,
      references: references.length > 0 ? references : undefined,
      author: authorString || undefined,
      date: generalInfo.date || undefined,
      modified: generalInfo.modifiedDate || undefined,
      tags: tags.length > 0 ? (tags.length === 1 ? tags[0] : tags) : undefined,
      logsource: {
        product: logsrc.product || undefined,
        service: logsrc.service || undefined,
        category: logsrc.category || undefined,
        definition: logsrc.definition || undefined,
      },
      detection: {
        selection: processedSelection,
        ...(Object.keys(processedSelection).length > 0
          ? { selection: processedSelection }
          : { selection: "" }),
        ...(Object.keys(processedFilters).length > 0
          ? { filter: processedFilters }
          : undefined),
        keywords: selectionKeywords.length > 0 ? selectionKeywords : undefined,
      },
      timeframe:
        timeframe.timeframe !== ""
          ? timeframe.timeframe + timeframe.unit
          : undefined,
      condition: condition || undefined,
      fields:
        fields.length > 0
          ? fields.length === 1
            ? fields[0]
            : fields
          : undefined,

      falsepositives:
        fps.length > 0 ? (fps.length === 1 ? fps[0] : fps) : undefined,
      level: generalInfo.level || undefined,
    };
    let yamlString = yaml.dump(yamlData);
    yamlString = yamlString.replace("logsource: {}", "logsource:");

    const blob = new Blob([yamlString], { type: "text/yaml" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      generalInfo.title === "" ? "Unnamed.yaml" : generalInfo.title + ".yml";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          variant="contained"
          onClick={handleGenerateYaml}
          startIcon={<DownloadIcon />}
        >
          Export rule
        </Button>

        {showAlert && (
          <Alert severity="error" onClose={() => setShowAlert(false)}>
            {alertMessage}
          </Alert>
        )}
      </Grid>
    </>
  );
}
