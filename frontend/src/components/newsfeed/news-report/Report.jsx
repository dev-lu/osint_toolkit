import React, { useState, useRef } from 'react';
import {
  Avatar,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  timelineOppositeContentClasses
} from '@mui/lab';

import SearchIcon from '@mui/icons-material/Search';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import api from '../../../api';

function getTimelineDotIcon(step, stepIndex, DefaultIcon) {
  if (step === stepIndex) {
    return <DefaultIcon />;
  }
  if (step > stepIndex) {
    return <CheckCircleOutlineIcon />;
  }
  return null;
}

export default function Report() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  const [ranking, setRanking] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);

  const eventSourceRef = useRef(null);

  const showStopButton = step >= 1 && step < 5;

  const startAnalysis = () => {
    setStep(1);
    setIsLoading(true);
    setError(null);
    setInfoMessage(null);
    setRanking([]);
    setAnalysisResults([]);

    const url = `${api.defaults.baseURL}/api/analyze_top_articles_stream`; 
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const rawData = event.data;
      if (!rawData || !rawData.trim()) return;

      try {
        const parsed = JSON.parse(rawData);

        switch (parsed.type) {
          case 'ranking':
            setStep(3);
            setRanking(parsed.articles || []);
            if (parsed.info) {
              setInfoMessage(parsed.info);
            }
            break;

          case 'analysis':
            setStep(4);
            if (parsed.article_result) {
              setAnalysisResults((prev) => [...prev, parsed.article_result]);
            }
            break;

          case 'complete':
            setStep(5);
            setIsLoading(false);
            setInfoMessage(parsed.message);
            es.close();
            eventSourceRef.current = null;
            break;

          default:
            break;
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    es.onerror = (err) => {
      console.error('EventSource error:', err);
      setError('An error occurred while streaming data.');
      setIsLoading(false);
      setStep(0);

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  };

  const stopAnalysis = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setStep(0);
    setIsLoading(false);
    setInfoMessage('Analysis stream stopped by user.');
  };

  const chipColorMap = {
    High: 'error',
    Medium: 'warning',
    Low: 'success',
    Informational: 'info'
  };

  const generateMarkdown = () => {
    let md = `# Newsfeed Analysis Report\n\n`;
    md += `**Analysis Date:** ${new Date().toLocaleString()}\n\n`;

    // Section 1: Top 10 Ranking
    md += `## Top Ranked Articles\n\n`;
    if (ranking.length === 0) {
      md += `_No articles were ranked._\n\n`;
    } else {
      ranking.forEach((article, index) => {
        md += `**${index + 1}. ${article.title}**\n\n`;
        md += `- **Reason**: ${article.reason}\n\n`;
      });
    }

    // Section 2: Detailed Analysis
    md += `## Detailed Analysis\n\n`;
    if (analysisResults.length === 0) {
      md += `_No detailed analysis yet._\n\n`;
    } else {
      analysisResults.forEach((res, i) => {
        const { title, analysis } = res;
        md += `### ${i + 1}. ${title}\n\n`;
        md += `- **Risk**: ${analysis.Risk}\n`;
        md += `- **Summary**: ${analysis.Summary}\n`;
        md += `- **Comment**: ${analysis['Analysis comment']}\n`;
        md += `- **Possible Action Items**:\n`;
        (analysis['Action items'] || []).forEach((item) => {
          md += `  - ${item}\n`;
        });
        md += `- **Source**: ${analysis['Source']}\n\n`;
      });
    }

    return md;
  };


  const handleExportMarkdown = () => {
    const markdownContent = generateMarkdown();
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'analysis_report.md');
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Timeline steps
  const steps = [
    {
      stepIndex: 1,
      label: 'Fetch all news articles of the last 7 days',
      Icon: SearchIcon,
      renderContent: () => null
    },
    {
      stepIndex: 2,
      label: 'Rank news articles by relevance',
      Icon: AnalyticsIcon,
      renderContent: () => null
    },
    {
      stepIndex: 3,
      label: 'Show 10 most relevant articles',
      Icon: ListAltIcon,
      renderContent: () => {
        if (step < 3) return null;
        return (
          <Box>
            {ranking.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No articles found or none returned.
              </Typography>
            )}
            {ranking.map((article, idx) => (
              <Card key={article.id} variant="outlined" sx={{ mb: 2 }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar>{idx + 1}</Avatar>
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                          {article.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reason: {article.reason}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </Card>
            ))}
          </Box>
        );
      }
    },
    {
      stepIndex: 4,
      label: 'Analyze most relevant articles and create reports',
      Icon: AssessmentOutlinedIcon,
      renderContent: () => {
        if (step < 4) return null;
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Detailed Analysis
            </Typography>
            {analysisResults.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Waiting for the first analysis result…
              </Typography>
            )}
            {analysisResults.map((res, i) => {
              const { article_id, title, relevance_score, analysis } = res;
              return (
                <Card
                  key={`${article_id}-${i}`}
                  variant="outlined"
                  sx={{ mb: 2, boxShadow: 3, borderRadius: 2, position: 'relative' }}
                >
                  <CardHeader
                    title={
                      <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', width: '80%' }}>
                        {title}
                      </Typography>
                    }
                    action={
                      <Chip
                        label={'Risk: ' + analysis.Risk}
                        color={chipColorMap[analysis.Risk] || 'default'}
                        size="small"
                        sx={{ position: 'absolute', top: 8, right: 8, borderRadius: 1 }}
                      />
                    }
                  />
                  <CardContent sx={{ pt: 1 }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Summary:</strong> {analysis.Summary}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Reason:</strong> {analysis['Analysis comment']}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        Possible Action Items:
                      </Typography>
                      <List dense>
                        {(analysis['Action items'] || []).map((item, idx2) => (
                          <ListItem key={idx2}>
                            <ListItemText primary={`- ${item}`} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Source:</strong> {analysis['Source']}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        );
      }
    },
    {
      stepIndex: 5,
      label: 'Completed analysis and report creation',
      Icon: CheckCircleOutlineIcon,
      renderContent: () => {
        if (step < 5) return null;
        return (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Analysis Complete
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              All articles have been analyzed. You may restart if you wish to run another analysis.
            </Typography>
            <Button variant="contained" onClick={handleExportMarkdown}>
              Download Markdown Report
            </Button>
          </Box>
        );
      }
    }
  ];

  return (
    <Box sx={{ width: '100%', py: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        News Report Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This tool fetches all cybersecurity news from the last 7 days, ranks the top 10 relevant news by headline,
        and then provides a detailed analysis of each article.
      </Typography>

      {/* Start / Stop Buttons */}
      {!showStopButton && step !== 5 && (
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" onClick={startAnalysis}>
            Start Analysis
          </Button>
        </Box>
      )}
      {showStopButton && (
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" color="error" onClick={stopAnalysis}>
            Stop Analysis
          </Button>
        </Box>
      )}

      {/* Global Loading Indicator */}
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography>Fetching / Analyzing…</Typography>
        </Box>
      )}

      {/* Error & Info Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {infoMessage && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {infoMessage}
        </Alert>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Left-Aligned Timeline */}
      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.18
          }
        }}
      >
        {steps
          .filter((item) => step >= item.stepIndex)
          .map((item, idx, arr) => {
            const { stepIndex, label, Icon, renderContent } = item;
            const DotIcon = getTimelineDotIcon(step, stepIndex, Icon);

            return (
              <TimelineItem key={stepIndex} sx={{ alignItems: 'flex-start' }}>
                <TimelineOppositeContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    textAlign: 'right'
                  }}
                  color="text.secondary"
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                </TimelineOppositeContent>

                <TimelineSeparator>
                  {idx > 0 && <TimelineConnector />}
                  <TimelineDot color="primary">{DotIcon}</TimelineDot>
                  {idx < arr.length - 1 && <TimelineConnector />}
                </TimelineSeparator>

                <TimelineContent
                  sx={{
                    py: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                  }}
                >
                  {renderContent()}
                </TimelineContent>
              </TimelineItem>
            );
          })}
      </Timeline>
    </Box>
  );
}
