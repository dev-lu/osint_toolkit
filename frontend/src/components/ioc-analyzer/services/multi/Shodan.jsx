import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationCity as LocationIcon,
  Public as PublicIcon,
  Language as DomainIcon,
  Router as PortIcon,
  DNS as HostIcon,
  Label as TagIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Storage as DataIcon,
} from '@mui/icons-material';

import api from '../../../../api';
import ResultRow from '../../ResultRow';

const CollapsibleSection = ({ title, icon: Icon, children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box sx={{ mb: 2 }}>
      <ListItemButton onClick={() => setExpanded(!expanded)} sx={{ borderRadius: 1 }}>
        <ListItemIcon>
          <Icon color="primary" />
        </ListItemIcon>
        <ListItemText primary={title} />
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={expanded}>
        <Box sx={{ pl: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

const DataDisplay = ({ data }) => {
  if (typeof data === 'object' && data !== null) {
    return (
      <List dense sx={{ width: '100%', overflowX: 'hidden' }}>
        {Object.entries(data).map(([key, value]) => (
          <ListItem key={key} sx={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
            <Typography variant="subtitle2" color="primary" noWrap>
              {key}
            </Typography>
            <Box sx={{ pl: 2, width: '100%', overflowWrap: 'break-word' }}>
              {typeof value === 'object' ? (
                <DataDisplay data={value} />
              ) : (
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{String(value)}</Typography>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    );
  }
  return <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{String(data)};</Typography>;
};

export default function Shodan({ ioc, type }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `/api/${type}/shodan?ioc=${encodeURIComponent(ioc)}`;
        const response = await api.get(url);
        setResult(response.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [ioc, type]);

  const generalInfo = result && (
    <List dense>
      <ListItem>
        <ListItemIcon><LocationIcon /></ListItemIcon>
        <ListItemText 
          primary="Location" 
          secondary={[
            result.city,
            result.region_code,
            result.country_name,
            result.postal_code
          ].filter(Boolean).join(', ') || 'N/A'} 
        />
      </ListItem>
      <ListItem>
        <ListItemIcon><BusinessIcon /></ListItemIcon>
        <ListItemText 
          primary="Organization" 
          secondary={`${result.org || 'N/A'} (${result.asn || 'N/A'})`} 
        />
      </ListItem>
      <ListItem>
        <ListItemIcon><PublicIcon /></ListItemIcon>
        <ListItemText 
          primary="ISP" 
          secondary={result.isp || 'N/A'} 
        />
      </ListItem>
    </List>
  );

  const details = result && !result.shodan_error && (
    <Card sx={{ p: 2, maxWidth: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: 3 }}>
        {generalInfo}
      </Box>
      
      <Divider sx={{ mb: 2 }} />

      {result.ports?.length > 0 && (
        <CollapsibleSection title="Open Ports" icon={PortIcon} defaultExpanded>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {result.ports.map((port, idx) => (
              <Chip 
                key={idx}
                label={port}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </CollapsibleSection>
      )}

      {(result.domains?.length > 0 || result.hostnames?.length > 0) && (
        <CollapsibleSection title="Domains & Hostnames" icon={DomainIcon} defaultExpanded>
          {result.domains?.length > 0 && (
            <Box sx={{ mb: 2, mt: 1 }}>
              <Typography variant="subtitle2" color="primary">Domains</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {result.domains.map((domain, idx) => (
                  <Chip 
                    key={idx}
                    label={domain}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
          
          {result.hostnames?.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="primary">Hostnames</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {result.hostnames.map((hostname, idx) => (
                  <Chip 
                    key={idx}
                    label={hostname}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </CollapsibleSection>
      )}

      {result.data?.length > 0 && (
        <CollapsibleSection title="Detailed Data" icon={DataIcon}>
          {result.data.map((item, idx) => (
            <Card key={idx} variant="outlined" sx={{ mb: 1, p: 1, mt: 1 }}>
              <DataDisplay data={item} />
            </Card>
          ))}
        </CollapsibleSection>
      )}

      {result.tags?.length > 0 && (
        <CollapsibleSection title="Tags" defaultExpanded icon={TagIcon}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {result.tags.map((tag, idx) => (
              <Chip 
                key={idx}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </CollapsibleSection>
      )}
    </Card>
  );

  const getSummary = () => {
    if (!result || result.shodan_error) return "No data available";
    const parts = [];
    if (result.org) parts.push(result.org);
    if (result.ports?.length) parts.push(`${result.ports.length} open ports`);
    return parts.join(' • ') || "See details";
  };

  return (
    <ResultRow
      name="Shodan"
      id="shodan"
      icon="shodan_logo_small"
      loading={loading}
      result={result}
      summary={getSummary()}
      color="primary"
      error={error}
      details={details}
    />
  );
}