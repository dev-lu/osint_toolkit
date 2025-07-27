import React, { useState } from 'react'; 
import {
  Box,
  Card,
  CardContent, 
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationCity as LocationIcon,
  Public as PublicIcon,
  Language as DomainIcon,
  Router as PortIcon, 
  Label as TagIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Security as SecurityIcon,
  Storage as DataIcon, 
  InfoOutlined as InfoOutlinedIcon, 
} from '@mui/icons-material';

import NoDetails from '../NoDetails';

const CollapsibleSection = ({ title, icon: Icon, children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box sx={{ mb: 1 }}> 
      <ListItemButton onClick={() => setExpanded(!expanded)} sx={{ borderRadius: 1, py: 0.5, px:1 }}> 
        <ListItemIcon sx={{minWidth: 36}}>
          <Icon color="primary" />
        </ListItemIcon>
        <ListItemText primary={title} primaryTypographyProps={{variant: 'subtitle1', fontWeight:'medium'}}/>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ pt: 1, pb:1, pl: 2, pr: 1 }}> 
          {children}
        </Box>
      </Collapse>
      <Divider sx={{mt:1}}/>
    </Box>
  );
};

const DataDisplay = ({ data, level = 0 }) => {
  if (typeof data === 'object' && data !== null) {
    if (level === 1 && data.location && typeof data.location === 'object') {
        const { location, ...restOfData } = data;
        return (
            <>
                {Object.entries(location).map(([key, value]) => (
                     <ListItem key={`loc-${key}`} sx={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%', py:0.2, pl: level > 0 ? 1 : 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{fontWeight:'medium'}}>
                        location.{key}:
                        </Typography>
                        <Box sx={{ pl: 1, width: '100%', overflowWrap: 'break-word' }}>
                            <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>{String(value)}</Typography>
                        </Box>
                    </ListItem>
                ))}
                <DataDisplay data={restOfData} level={level +1} />
            </>
        );
    }


    return (
      <List dense disablePadding sx={{ width: '100%', overflowX: 'hidden' }}>
        {Object.entries(data).map(([key, value]) => (
          <ListItem key={key} sx={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%', py:0.2, pl: level > 0 ? 1 : 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{fontWeight:'medium', textTransform: 'capitalize'}}> 
              {key.replace(/_/g, ' ')}:
            </Typography>
            <Box sx={{ pl: 1, width: '100%', overflowWrap: 'break-word' }}>
              {typeof value === 'object' && value !== null && !Array.isArray(value) ? ( 
                <DataDisplay data={value} level={level + 1} />
              ) : Array.isArray(value) ? (
                <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>{value.join(', ')}</Typography>
              ) : (
                <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>{String(value)}</Typography>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    );
  }
  return <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>{String(data)}</Typography>;
};


export default function ShodanDetails({ result, ioc }) { 

  if (!result) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message="Loading Shodan details..." />
      </Box>
    );
  }

  if (result.shodan_error || result.error) {
    const errorMessage = result.shodan_error || (result.error ? (result.message || result.error) : "Unknown error");
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`Error fetching Shodan details: ${errorMessage}`} />
      </Box>
    );
  }
  
  if (result.error === "No information available" || (Object.keys(result).length === 1 && result.ip_str && !result.ports && !result.data )) {
     return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`No detailed Shodan information found for "${result.ip_str || ioc}".`} />
      </Box>
    );
  }


  const generalInfo = (
    <List dense>
      <ListItem>
        <ListItemIcon sx={{minWidth:36}}><LocationIcon /></ListItemIcon>
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
        <ListItemIcon sx={{minWidth:36}}><BusinessIcon /></ListItemIcon>
        <ListItemText 
          primary="Organization / ASN" 
          secondary={`${result.org || 'N/A'} (${result.asn || 'N/A'})`} 
        />
      </ListItem>
      <ListItem>
        <ListItemIcon sx={{minWidth:36}}><PublicIcon /></ListItemIcon>
        <ListItemText 
          primary="ISP" 
          secondary={result.isp || 'N/A'} 
        />
      </ListItem>
       <ListItem>
        <ListItemIcon sx={{minWidth:36}}><DomainIcon /></ListItemIcon>
        <ListItemText 
          primary="Last Update" 
          secondary={result.last_update ? new Date(result.last_update).toLocaleString() : 'N/A'} 
        />
      </ListItem>
    </List>
  );

  return (
    <Box sx={{ margin: 1, mt:0 }}>
      <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
            <Grid container spacing={1} alignItems="center" mb={1}>
                <InfoOutlinedIcon color="action" />
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                Shodan IP Report for: <Typography component="span" sx={{wordBreak: 'break-all'}}>{result.ip_str || ioc}</Typography>
                </Typography>
            </Grid>
            
            {generalInfo}
            <Divider sx={{ my: 1 }} />

            {result.ports?.length > 0 && (
                <CollapsibleSection title={`Open Ports (${result.ports.length})`} icon={PortIcon} defaultExpanded>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {result.ports.map((port, idx) => (
                    <Chip key={idx} label={port} size="small" variant="filled" color="info" sx={{borderRadius:1}} />
                    ))}
                </Box>
                </CollapsibleSection>
            )}

            {(result.domains?.length > 0 || result.hostnames?.length > 0) && (
                <CollapsibleSection title="Domains & Hostnames" icon={DomainIcon} defaultExpanded>
                {result.domains?.length > 0 && (
                    <Box sx={{ mb: result.hostnames?.length > 0 ? 1: 0, mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" display="block">Domains ({result.domains.length}):</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {result.domains.map((domain, idx) => ( <Chip key={`dom-${idx}`} label={domain} size="small" variant="outlined" /> ))}
                    </Box>
                    </Box>
                )}
                
                {result.hostnames?.length > 0 && (
                    <Box sx={{mt: 0.5}}>
                    <Typography variant="caption" color="text.secondary" display="block">Hostnames ({result.hostnames.length}):</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {result.hostnames.map((hostname, idx) => ( <Chip key={`host-${idx}`} label={hostname} size="small" variant="outlined" /> ))}
                    </Box>
                    </Box>
                )}
                </CollapsibleSection>
            )}

            {result.tags?.length > 0 && (
                <CollapsibleSection title={`Tags (${result.tags.length})`} icon={TagIcon}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {result.tags.map((tag, idx) => ( <Chip key={`tag-${idx}`} label={tag} size="small" variant="filled" color="secondary" sx={{borderRadius:1}}/> ))}
                </Box>
                </CollapsibleSection>
            )}

            {result.data?.length > 0 && (
                <CollapsibleSection title={`Service Banners / Detailed Data (${result.data.length})`} icon={DataIcon}>
                {result.data.map((item, idx) => (
                    <Card key={idx} variant="outlined" sx={{ mb: 1, mt:0.5 }}>
                        <CardContent sx={{p:1, '&:last-child': {pb:1}}}> 
                            <DataDisplay data={item} />
                        </CardContent>
                    </Card>
                ))}
                </CollapsibleSection>
            )}

            {result.vulns?.length > 0 && (
                 <CollapsibleSection title={`Vulnerabilities (${result.vulns.length})`} icon={SecurityIcon} defaultExpanded>
                    <List dense disablePadding>
                        {result.vulns.map((vuln_id, idx) => (
                            <ListItem key={idx} dense disableGutters>
                                <ListItemText primary={vuln_id} primaryTypographyProps={{variant:'body2', color:'error.main'}}/>
                            </ListItem>
                        ))}
                    </List>
                 </CollapsibleSection>
            )}


        </CardContent>
      </Card>
    </Box>
  );
}