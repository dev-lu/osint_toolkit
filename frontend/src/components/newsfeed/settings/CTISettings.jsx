import React, { useEffect, useState } from "react";
import api from "../../../api";
import {
  Card,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  Chip,
  Snackbar,
  Alert,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function CTISettings() {
  const theme = useTheme();
  const [ctiSettings, setCtiSettings] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const cardStyle = {
    p: 2,
    boxShadow: theme.shadows[1],
    borderRadius: 1,
  };

  useEffect(() => {
    api
      .get("/api/settings/cti")
      .then((response) => {
        setCtiSettings(response.data.settings || {});
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setSnackbarMessage("Failed to load CTI settings.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  }, []);

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const handleInputChange = (category, field, value) => {
    setCtiSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [field]: value,
      },
    }));
  };

  const handleAttackTypePriorityChange = (attackType, priority) => {
    setCtiSettings((prevSettings) => {
      const updatedPriorities = {
        ...(prevSettings.threat_actor_and_attack_type?.attack_type_priorities ||
          {}),
        [attackType]: priority,
      };
      return {
        ...prevSettings,
        threat_actor_and_attack_type: {
          ...prevSettings.threat_actor_and_attack_type,
          attack_type_priorities: updatedPriorities,
        },
      };
    });
  };

  const handleSave = () => {
    api
      .put("/api/settings/cti", { settings: ctiSettings })
      .then(() => {
        setSnackbarMessage("CTI settings saved successfully.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage("Failed to save CTI settings.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const industryOptions = [
    "Finance",
    "Healthcare",
    "Technology",
    "Retail",
    "Energy",
  ];
  const companySizeOptions = ["Small", "Medium", "Large"];
  const geographicalScopeOptions = ["North America", "EMEA", "APAC", "Global"];
  const languageOptions = ["English", "Spanish", "French", "German", "Chinese"];
  const attackTypeOptions = [
    "Ransomware",
    "DDoS",
    "Phishing",
    "Insider Threats",
    "Supply Chain",
  ];
  const priorityOptions = ["High", "Medium", "Low"];
  const motivationOptions = [
    "Financial",
    "Political",
    "Data Theft",
    "Reputational Damage",
  ];

  const renderAutocomplete = (label, options, value, onChange, placeholder) => (
    <Autocomplete
      multiple
      freeSolo
      options={options}
      value={value || []}
      onChange={onChange}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
      sx={{ mb: 2 }}
    />
  );

  const CompanyProfileTab = () => (
    <Box sx={{ p: 1 }}>
      {renderAutocomplete(
        "Industry Selection",
        industryOptions,
        ctiSettings.company_profile?.industry_selection,
        (e, newValue) =>
          handleInputChange("company_profile", "industry_selection", newValue),
        "Add or select industries"
      )}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Company Size</InputLabel>
        <Select
          value={ctiSettings.company_profile?.company_size || ""}
          onChange={(e) =>
            handleInputChange("company_profile", "company_size", e.target.value)
          }
        >
          {companySizeOptions.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {renderAutocomplete(
        "Geographical Scope",
        geographicalScopeOptions,
        ctiSettings.company_profile?.geographical_scope,
        (e, newValue) =>
          handleInputChange("company_profile", "geographical_scope", newValue),
        "Add or select regions"
      )}
      {renderAutocomplete(
        "Primary Language",
        languageOptions,
        ctiSettings.company_profile?.primary_language,
        (e, newValue) =>
          handleInputChange("company_profile", "primary_language", newValue),
        "Add or select languages"
      )}
      {renderAutocomplete(
        "Brand Mentions",
        [],
        ctiSettings.company_profile?.brand_mentions,
        (e, newValue) =>
          handleInputChange("company_profile", "brand_mentions", newValue),
        "Add brand names"
      )}
      {renderAutocomplete(
        "Competitor News Monitoring",
        [],
        ctiSettings.company_profile?.competitor_news_monitoring,
        (e, newValue) =>
          handleInputChange(
            "company_profile",
            "competitor_news_monitoring",
            newValue
          ),
        "Add competitor names"
      )}
    </Box>
  );

  const ThreatActorTab = () => (
    <Box sx={{ p: 1 }}>
      {renderAutocomplete(
        "Relevant Threat Actors",
        [],
        ctiSettings.threat_actor_and_attack_type?.relevant_threat_actors,
        (e, newValue) =>
          handleInputChange(
            "threat_actor_and_attack_type",
            "relevant_threat_actors",
            newValue
          ),
        "Add threat actor names"
      )}
      {renderAutocomplete(
        "Known Threat Actor Names",
        [],
        ctiSettings.threat_actor_and_attack_type?.known_threat_actor_names,
        (e, newValue) =>
          handleInputChange(
            "threat_actor_and_attack_type",
            "known_threat_actor_names",
            newValue
          ),
        "Add known threat actor names"
      )}
      {renderAutocomplete(
        "Attack Types of Interest",
        attackTypeOptions,
        ctiSettings.threat_actor_and_attack_type?.attack_types_of_interest,
        (e, newValue) => {
          handleInputChange(
            "threat_actor_and_attack_type",
            "attack_types_of_interest",
            newValue
          );
        },
        "Add or select attack types"
      )}
      {/* Attack Type */}
      {ctiSettings.threat_actor_and_attack_type?.attack_types_of_interest?.map(
        (attackType) => (
          <Box
            key={attackType}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <Typography sx={{ mr: 2 }}>{attackType}</Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={
                  ctiSettings.threat_actor_and_attack_type
                    ?.attack_type_priorities?.[attackType] || ""
                }
                onChange={(e) =>
                  handleAttackTypePriorityChange(attackType, e.target.value)
                }
                label="Priority"
              >
                {priorityOptions.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )
      )}
      {renderAutocomplete(
        "Motivation Filters",
        motivationOptions,
        ctiSettings.threat_actor_and_attack_type?.motivation_filters,
        (e, newValue) =>
          handleInputChange(
            "threat_actor_and_attack_type",
            "motivation_filters",
            newValue
          ),
        "Add or select motivations"
      )}
    </Box>
  );

  return (
    <>
      <Card sx={cardStyle}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">CTI Settings</Typography>
          <Typography variant="body2">
            Configure your Cyber Threat Intelligence (CTI) settings.
          </Typography>
        </Box>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Company Profile" />
          <Tab label="Threat Actors" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              {tabIndex === 0 && <CompanyProfileTab />}
              {tabIndex === 1 && <ThreatActorTab />}
              <Box sx={{ textAlign: "left", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={handleSave}
                >
                  Save Settings
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
