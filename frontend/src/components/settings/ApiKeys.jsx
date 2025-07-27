import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import ApiKeyInput from "./ApiKeyInput";
import { apiKeysState } from "../../state";
import api from "../../api";

import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Box,
  Grid,
  Paper,
  Alert,
  AlertTitle,
  LinearProgress,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";

export default function ApiKeys() {
  const apiKeys = useRecoilValue(apiKeysState);
  const theme = useTheme();
  const [searchFilter, setSearchFilter] = useState("");
  const [showOnlyConfigured, setShowOnlyConfigured] = useState(false);
  const [servicesConfig, setServicesConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerExpanded, setHeaderExpanded] = useState(false);

  useEffect(() => {
    const fetchServicesConfig = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/services/config");
        setServicesConfig(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching services config:", err);
        setError("Failed to load service configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchServicesConfig();
  }, [apiKeys]);

  const getConfiguredCount = () => {
    return Object.values(servicesConfig).reduce((count, service) => {
      return count + (service.available ? 1 : 0);
    }, 0);
  };

  const getCompletionPercentage = () => {
    const totalServices = Object.keys(servicesConfig).length;
    if (totalServices === 0) return 0;
    const configuredServices = getConfiguredCount();
    return Math.round((configuredServices / totalServices) * 100);
  };

  const filteredServices = Object.entries(servicesConfig).filter(([key, service]) => {
    const matchesSearch = service.name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesFilter = !showOnlyConfigured || service.available;
    return matchesSearch && matchesFilter;
  });

  const getCapabilityColor = (capability) => {
    const colors = {
      IPv4: "#1976d2",
      IPv6: "#1976d2",
      Domains: "#388e3c",
      URLs: "#f57c00",
      Hashes: "#7b1fa2",
      Email: "#d32f2f",
      CVEs: "#e64a19",
      "AI Features": "#5e35b1",
      ASN: "#795548",
      Domain: "#388e3c",
      URL: "#f57c00",
      MD5: "#7b1fa2",
      SHA1: "#7b1fa2",
      SHA256: "#7b1fa2",
      CVE: "#e64a19",
    };
    return colors[capability] || "#616161";
  };

  const getTierColor = (tier) => {
    const colors = {
      free: "#4caf50",
      paid: "#f44336",
      freemium: "#ff9800",
    };
    return colors[tier] || "#616161";
  };

  const getTierLabel = (tier) => {
    const labels = {
      free: "Free",
      paid: "Paid",
      freemium: "Freemium",
    };
    return labels[tier] || tier;
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">
            Loading service configuration...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Alert severity="error" icon={<ErrorIcon />}>
          <AlertTitle>Configuration Error</AlertTitle>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Header Section */}
      <Accordion
        expanded={headerExpanded}
        onChange={() => setHeaderExpanded(!headerExpanded)}
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '0 0 32px 0',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            p: 2,
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },
            '& .MuiAccordionSummary-content.Mui-expanded': {
              margin: 0,
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <SecurityIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                API Key Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getConfiguredCount()}/{Object.keys(servicesConfig).length} services configured ({getCompletionPercentage()}% complete)
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        
        <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
          <Stack spacing={3}>
            <Typography variant="body1" color="text.secondary">
              Configure your threat intelligence and security API keys to unlock the full potential of this platform.
            </Typography>

            {/* Progress Overview */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Configuration Progress ({getConfiguredCount()}/{Object.keys(servicesConfig).length} services)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {getCompletionPercentage()}% Complete
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getCompletionPercentage()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.grey[200],
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                  },
                }}
              />
            </Box>

            <Alert severity="info" icon={<InfoIcon />}>
              <AlertTitle>Getting Started</AlertTitle>
              While initial setup requires generating multiple API keys, the enhanced security and intelligence capabilities make it worthwhile. Most services offer free tiers to get you started.
            </Alert>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <TextField
            placeholder="Search services..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyConfigured}
                onChange={(e) => setShowOnlyConfigured(e.target.checked)}
                color="primary"
                sx={{mr: 1}}
              />
            }
            label="Show only configured"
          />
        </Stack>
      </Paper>

      {/* API Services Grid */}
      <Grid container spacing={3}>
        {filteredServices.map(([serviceKey, service]) => {
          const isFullyConfigured = service.available;
          const hasMultipleKeys = service.required_keys.length > 1;

          return (
            <Grid item xs={12} lg={6} key={serviceKey}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    boxShadow: theme.shadows[4],
                    transform: "translateY(-2px)",
                  },
                  border: isFullyConfigured
                    ? `2px solid ${theme.palette.success.main}`
                    : `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    {/* Provider Header */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {service.name}
                          </Typography>
                          <Chip
                            label={getTierLabel(service.tier)}
                            size="small"
                            sx={{
                              backgroundColor: `${getTierColor(service.tier)}15`,
                              color: getTierColor(service.tier),
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.5, mb: 2 }}
                        >
                          {service.description}
                        </Typography>
                      </Box>
                      {isFullyConfigured && (
                        <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                      )}
                    </Box>

                    {/* Capabilities */}
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                        Supported IoC Types
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {service.supported_ioc_types.map((capability) => (
                          <Chip
                            key={capability}
                            label={capability}
                            size="small"
                            sx={{
                              backgroundColor: `${getCapabilityColor(capability)}15`,
                              color: getCapabilityColor(capability),
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Divider />

                    {/* API Key Inputs */}
                    {service.required_keys.length === 0 ? (
                      <Box sx={{ p: 2, backgroundColor: theme.palette.success.main + "08", borderRadius: 1 }}>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                          ✓ No API key required - Ready to use
                        </Typography>
                      </Box>
                    ) : (
                      service.required_keys.map((keyName, index) => {
                        // Generate display name for the key
                        let keyDisplayName = keyName
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, l => l.toUpperCase());
                        
                        // Handle special cases
                        if (keyName.includes('client_id')) keyDisplayName = `${service.name} Client ID`;
                        if (keyName.includes('client_secret')) keyDisplayName = `${service.name} Client Secret`;
                        if (keyName.includes('api_key')) keyDisplayName = `${service.name} API Key`;
                        if (keyName.includes('pat')) keyDisplayName = `${service.name} Personal Access Token`;
                        if (keyName.includes('bearer')) keyDisplayName = `${service.name} Bearer Token`;

                        const relatedKeys = service.required_keys.filter(k => k !== keyName);

                        return (
                          <ApiKeyInput
                            key={keyName}
                            name={keyName}
                            description={keyDisplayName}
                            link={service.documentation_url}
                            apiKeys={apiKeys}
                            relatedKeys={relatedKeys}
                          />
                        );
                      })
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredServices.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No services found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
