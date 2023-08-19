import { atom } from "recoil";

export const RuleIdAtom = atom({
  key: "RuleIdAtom",
  default: "",
});

export const GeneralInfoAtom = atom({
  key: "GeneralInfoAtom",
  default: {
    title: "",
    description: "",
    license: "",
    status: "",
    level: "",
    date: "",
    modifiedDate: "",
  },
});

export const AuthorAtom = atom({
  key: "AuthorAtom",
  default: [],
});

export const SelectionFieldAtom = atom({
  key: "SelectionFieldAtom",
  default: "",
});

export const SelectionModifierAtom = atom({
  key: "SelectionModifierAtom",
  default: "equals",
});

export const SelectionValueAtom = atom({
  key: "SelectionValueAtom",
  default: [],
});

export const SelectionStatementAtom = atom({
  key: "SelectionStatementAtom",
  default: [],
});

export const FilterFieldAtom = atom({
  key: "FilterFieldAtom",
  default: "",
});

export const FilterModifierAtom = atom({
  key: "FilterModifierAtom",
  default: "equals",
});

export const FilterValueAtom = atom({
  key: "FilterValueAtom",
  default: [],
});

export const FilterStatementAtom = atom({
  key: "FilterStatementAtom",
  default: [],
});

export const SelectionKeywordsAtom = atom({
  key: "SelectionKeywordsAtom",
  default: [],
});

export const FilterKeywordsAtom = atom({
  key: "FilterKeywordsAtom",
  default: [],
});

export const ConditionAtom = atom({
  key: "ConditionAtom",
  default: "",
});

export const FalsepositivesAtom = atom({
  key: "FalsepositivesAtom",
  default: [],
});

export const FieldsAtom = atom({
  key: "FieldsAtom",
  default: [],
});

export const TagsAtom = atom({
  key: "TagsAtom",
  default: [],
});

export const ReferencesAtom = atom({
  key: "ReferencesAtom",
  default: [],
});

export const TimeframeAtom = atom({
  key: "TimeframeAtom",
  default: {
    timeframe: "",
    unit: "s",
  },
});

export const LogsourceAtom = atom({
  key: "logsource",
  default: {
    product: "",
    service: "",
    category: "",
    definition: "",
  },
});
