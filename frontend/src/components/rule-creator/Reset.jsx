import React from "react";
import { Button } from "@mui/material";
import { useResetRecoilState } from "recoil";

import {
  GeneralInfoAtom,
  AuthorAtom,
  SelectionFieldAtom,
  SelectionModifierAtom,
  SelectionValueAtom,
  SelectionStatementAtom,
  FilterFieldAtom,
  FilterModifierAtom,
  FilterValueAtom,
  FilterStatementAtom,
  SelectionKeywordsAtom,
  FilterKeywordsAtom,
  ConditionAtom,
  FalsepositivesAtom,
  FieldsAtom,
  TagsAtom,
  ReferencesAtom,
  TimeframeAtom,
  LogsourceAtom,
} from "./SigmaAtom";

export default function Reset() {
  const resetGeneralInfo = useResetRecoilState(GeneralInfoAtom);
  const resetAuthor = useResetRecoilState(AuthorAtom);
  const resetSelectionField = useResetRecoilState(SelectionFieldAtom);
  const resetSelectionModifier = useResetRecoilState(SelectionModifierAtom);
  const resetSelectionValue = useResetRecoilState(SelectionValueAtom);
  const resetSelectionStatement = useResetRecoilState(SelectionStatementAtom);
  const resetFilterField = useResetRecoilState(FilterFieldAtom);
  const resetFilterModifier = useResetRecoilState(FilterModifierAtom);
  const resetFilterValue = useResetRecoilState(FilterValueAtom);
  const resetFilterStatement = useResetRecoilState(FilterStatementAtom);
  const resetSelectionKeywords = useResetRecoilState(SelectionKeywordsAtom);
  const resetFilterKeywords = useResetRecoilState(FilterKeywordsAtom);
  const resetCondition = useResetRecoilState(ConditionAtom);
  const resetFalsepositives = useResetRecoilState(FalsepositivesAtom);
  const resetFields = useResetRecoilState(FieldsAtom);
  const resetTags = useResetRecoilState(TagsAtom);
  const resetReferences = useResetRecoilState(ReferencesAtom);
  const resetTimeframe = useResetRecoilState(TimeframeAtom);
  const resetLogsource = useResetRecoilState(LogsourceAtom);

  const handleReset = () => {
    resetGeneralInfo();
    resetAuthor();
    resetSelectionField();
    resetSelectionModifier();
    resetSelectionValue();
    resetSelectionStatement();
    resetFilterField();
    resetFilterModifier();
    resetFilterValue();
    resetFilterStatement();
    resetSelectionKeywords();
    resetFilterKeywords();
    resetCondition();
    resetFalsepositives();
    resetFields();
    resetTags();
    resetReferences();
    resetTimeframe();
    resetLogsource();
  };

  return (
    <Button
      variant="contained"
      disableElevation
      color="primary"
      onClick={handleReset}
    >
      Reset
    </Button>
  );
}
