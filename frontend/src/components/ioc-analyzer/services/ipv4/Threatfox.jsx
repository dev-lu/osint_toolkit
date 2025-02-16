import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Chip,
  Link,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  BugReport as MalwareIcon,
  Language as UrlIcon,
  Schedule as TimeIcon,
  Person as PersonIcon,
  Label as TagIcon,
  Info as InfoIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import api from '../../../../api';
import ResultRow from '../../ResultRow';
import NoDetails from '../NoDetails';

export default function Threatfox({ ioc }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/ip/threatfox/${ioc}`);
        setResult(response.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [ioc]);

  const renderSection = (icon, title, content) => content && (
    <ListItem dense>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={title}
        secondary={content}
      />
    </ListItem>
  );

  const details = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {typeof result?.data === 'string' ? (
        <NoDetails message={result.data} />
      ) : result?.data?.length > 0 ? (
        result.data.map((data, index) => (
          <Card key={index} sx={{ borderRadius: 1 }}>
            <Box sx={{ p: 1 }}>
              <List disablePadding>
                {/* Basic Info */}
                {renderSection(
                  <AssignmentIcon color="primary" />,
                  "Identifier",
                  `ID: ${data.id}`
                )}
                {renderSection(
                  <UrlIcon color="primary" />,
                  "IOC",
                  data.ioc
                )}

                {/* Threat Info */}
                {renderSection(
                  <SecurityIcon color="primary" />,
                  "Threat Type",
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {data.threat_type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {data.threat_type_desc}
                    </Typography>
                  </Box>
                )}

                {/* IOC Info */}
                {renderSection(
                  <InfoIcon color="primary" />,
                  "IOC Type",
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {data.ioc_type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {data.ioc_type_desc}
                    </Typography>
                  </Box>
                )}

                {/* Malware Info */}
                {renderSection(
                  <MalwareIcon color="primary" />,
                  "Malware",
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {data.malware_printable} ({data.malware})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Alias: {data.malware_alias}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Confidence: {data.confidence_level}%
                    </Typography>
                    {data.malware_malpedia && (
                      <Link 
                        href={data.malware_malpedia} 
                        target="_blank" 
                        rel="noopener"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          typography: 'body2'
                        }}
                      >
                        <LinkIcon sx={{ fontSize: 16 }} />
                        Malpedia Entry
                      </Link>
                    )}
                  </Box>
                )}

                {/* Time Info */}
                {renderSection(
                  <TimeIcon color="primary" />,
                  "Timeline",
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      First seen: {data.first_seen}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Last seen: {data.last_seen || 'N/A'}
                    </Typography>
                  </Box>
                )}

                {/* Reporter */}
                {renderSection(
                  <PersonIcon color="primary" />,
                  "Reporter",
                  data.reporter
                )}

                {/* Tags */}
                {data.tags?.length > 0 && renderSection(
                  <TagIcon color="primary" />,
                  "Tags",
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {data.tags.map((tag, idx) => (
                      <Chip
                        key={idx}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderRadius: 1,
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </List>
            </Box>
          </Card>
        ))
      ) : (
        <NoDetails />
      )}
    </Box>
  );

  return (
    <ResultRow
      name="ThreatFox (abuse.ch)"
      id="threatfox"
      icon="threatfox_logo_small"
      loading={loading}
      result={result}
      summary={result?.query_status === "ok" ? "Malicious" : "Not Malicious"}
      color={result?.query_status === "ok" ? "red" : "green"}
      error={error}
      details={details}
    />
  );
}