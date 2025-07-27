import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Alert,
  Divider,
  Typography,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  HealthAndSafety as HealthAndSafetyIcon,
  GppMaybe as GppMaybeIcon
} from '@mui/icons-material';

import OperationControls from './components/ui/OperationControls';
import InputForm from './components/ui/InputForm';
import ResultsTable from './components/ui/ResultsTable';
import WelcomeScreen from './components/ui/WelcomeScreen';
import { useDefanger } from './hooks/useDefanger';

const IocDefanger = () => {
  const {
    inputText,
    results,
    operation,
    showOnlyChanged,
    copyFeedback,
    handleProcess,
    handleCopy,
    handleCopyAllResults,
    handleSwapOperation,
    handleClear,
    handleInputChange,
    handleToggleShowOnlyChanged,
    hasResults
  } = useDefanger();

  return (
    <Box>
      {/* Controls */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <OperationControls 
              operation={operation}
              onSwapOperation={handleSwapOperation}
            />
          </Grid>
          
          <Grid item xs={12}>
            <InputForm
              inputText={inputText}
              onInputChange={handleInputChange}
              operation={operation}
              onProcess={handleProcess}
              onClear={handleClear}
              onCopyAllResults={handleCopyAllResults}
              hasResults={hasResults}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Feedback */}
      {copyFeedback && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {copyFeedback}
        </Alert>
      )}

      {/* Results */}
      {hasResults && (
        <Paper sx={{ p: 3 }}>
          <ResultsTable
            results={results}
            operation={operation}
            showOnlyChanged={showOnlyChanged}
            onToggleShowOnlyChanged={handleToggleShowOnlyChanged}
            onCopy={handleCopy}
          />
        </Paper>
      )}

      {/* Help Section */}
      {!hasResults && (
        <Paper sx={{ p: 3 }}>
          <WelcomeScreen />
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            How to Use
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader
                  avatar={<HealthAndSafetyIcon color="success" />}
                  title="Defanging IOCs"
                  subheader="Make IOCs safe for sharing"
                />
                <CardContent>
                  <Typography variant="body2" paragraph>
                    Defanging replaces dangerous characters in IOCs to prevent accidental execution:
                  </Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', p: 1, borderRadius: 1 }}>
                    https://example.com → hxxps[://]example[.]com<br />
                    192.168.1.1 → 192[.]168[.]1[.]1<br />
                    user@domain.com → user[@]domain[.]com
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader
                  avatar={<GppMaybeIcon color="warning" />}
                  title="Fanging IOCs"
                  subheader="Restore original IOCs for analysis"
                />
                <CardContent>
                  <Typography variant="body2" paragraph>
                    Fanging restores defanged IOCs to their original form for analysis:
                  </Typography>
                  <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', p: 1, borderRadius: 1 }}>
                    hxxps[://]example[.]com → https://example.com<br />
                    192[.]168[.]1[.]1 → 192.168.1.1<br />
                    user[@]domain[.]com → user@domain.com
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default IocDefanger;
