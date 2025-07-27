import React from 'react';

import {
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Link,
  Grid, 
  Divider,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
  BugReport as MalwareIcon,
  Language as IocValueIcon,
  Schedule as TimeIcon,
  Person as PersonIcon,
  Label as TagIcon,
  InfoOutlined as InfoIcon, 
  Link as LinkIcon,
  ReportProblemOutlined as ReportProblemIcon, 
  CheckCircleOutline as CheckCircleOutlineIcon, 
} from '@mui/icons-material';

import NoDetails from '../NoDetails';

const RenderSection = ({ icon, title, content, dense = true }) => {
  if (!content && typeof content !== 'boolean') return null; 
  
  const secondaryContent = React.isValidElement(content) ? content : 
    (typeof content === 'boolean' ? (content ? "Yes" : "No") : String(content));

  return (
    <ListItem dense={dense} sx={{py: 0.5, alignItems: React.isValidElement(content) ? 'flex-start' : 'center'}}>
      <ListItemIcon sx={{minWidth: 36}}>
        {icon || <InfoIcon color="action" />}
      </ListItemIcon>
      <ListItemText
        primary={title}
        secondary={secondaryContent}
        primaryTypographyProps={{ variant: 'caption', fontWeight: 'medium', color: 'text.secondary' }}
        secondaryTypographyProps={{ variant: 'body2', component: React.isValidElement(content) ? 'div' : 'span', sx:{wordBreak: 'break-all'} }}
      />
    </ListItem>
  );
};


export default function ThreatfoxDetails({ result, ioc }) { 

  if (!result) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message="Loading ThreatFox details..." />
      </Box>
    );
  }

  if (result.error) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={`Error fetching ThreatFox details: ${result.message || result.error}`} />
      </Box>
    );
  }

  // query_status: "ok", "no_result", "illegal_search_term", "illegal_ioc_format"
  if (result.query_status !== "ok") {
    let message = `ThreatFox query status: ${result.query_status?.replace(/_/g, ' ') || "Unknown error"}.`;
    if (result.query_status === "no_result") {
      message = `IOC "${ioc}" not found in ThreatFox database.`;
      return (
        <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection:'column', minHeight: 100, textAlign:'center' }}>
            <CheckCircleOutlineIcon color="success" sx={{fontSize: 40, mb:1}}/>
            <Typography variant="h6">{message}</Typography>
        </Box>
      );
    }
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection:'column', minHeight: 100, textAlign:'center' }}>
        <ReportProblemIcon color="warning" sx={{fontSize: 40, mb:1}}/>
        <Typography variant="h6">{message}</Typography>
      </Box>
    );
  }

  if (!Array.isArray(result.data) || result.data.length === 0) {
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection:'column', minHeight: 100, textAlign:'center' }}>
         <CheckCircleOutlineIcon color="success" sx={{fontSize: 40, mb:1}}/>
        <Typography variant="h6">IOC Found by ThreatFox, but no specific data entries returned.</Typography>
        <Typography variant="body2" color="text.secondary">(This might indicate outdated or minimal information for this indicator.)</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
        <Grid container spacing={1} alignItems="center" mb={1}>
            <SecurityIcon color="action"/>
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
              ThreatFox Intelligence for: <Typography component="span" sx={{wordBreak: 'break-all'}}>{ioc}</Typography>
            </Typography>
        </Grid>
        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
            Displaying {result.data.length} record(s) from ThreatFox.
        </Typography>
        {result.data.map((entry, index) => (
        <Card key={entry.id || index} elevation={0} sx={{ mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{p:2}}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Entry ID: {entry.id} (Confidence: {entry.confidence_level}%)
                </Typography>
                <Divider sx={{mb:1}}/>
                <List disablePadding dense>
                    <RenderSection
                        icon={<IocValueIcon />}
                        title="IOC Value"
                        content={entry.ioc_value}
                    />
                    <RenderSection
                        icon={<InfoIcon />}
                        title="IOC Type"
                        content={<>{entry.ioc_type} <Typography variant="caption" color="text.disabled">({entry.ioc_type_desc})</Typography></>}
                    />
                    <RenderSection
                        icon={<SecurityIcon />}
                        title="Threat Type"
                        content={<>{entry.threat_type} <Typography variant="caption" color="text.disabled">({entry.threat_type_desc})</Typography></>}
                    />
                    <RenderSection
                        icon={<MalwareIcon />}
                        title="Malware"
                        content={
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {entry.malware_printable} ({entry.malware === 'unknown' ? 'Generic/Unknown' : entry.malware})
                                </Typography>
                                {entry.malware_alias && <Typography variant="caption" color="text.secondary">Alias: {entry.malware_alias}</Typography>}
                                <br/>
                                {entry.malware_malpedia && (
                                <Link 
                                    href={entry.malware_malpedia} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, typography: 'caption' }}
                                >
                                    <LinkIcon sx={{ fontSize: 'inherit' }} /> Malpedia Entry
                                </Link>
                                )}
                            </Box>
                        }
                    />
                    <RenderSection
                        icon={<TimeIcon />}
                        title="Timeline"
                        content={
                            <Box>
                                <Typography variant="caption">First seen: {entry.first_seen_utc ? new Date(entry.first_seen_utc).toLocaleString() : 'N/A'}</Typography><br/>
                                <Typography variant="caption">Last seen: {entry.last_seen_utc ? new Date(entry.last_seen_utc).toLocaleString() : 'N/A'}</Typography>
                            </Box>
                        }
                    />
                    <RenderSection
                        icon={<PersonIcon />}
                        title="Reporter"
                        content={entry.reporter}
                    />
                    {entry.reference && (
                        <RenderSection
                            icon={<LinkIcon />}
                            title="Reference"
                            content={
                                <Link href={entry.reference} target="_blank" rel="noopener noreferrer" sx={{typography:'body2'}}>
                                    {entry.reference}
                                </Link>
                            }
                        />
                    )}
                    {entry.tags?.length > 0 && <RenderSection
                        icon={<TagIcon />}
                        title="Tags"
                        content={
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.2 }}>
                            {entry.tags.map((tag, idx) => (
                            <Chip key={idx} label={tag} size="small" variant="outlined" sx={{ borderRadius: 1 }}/>
                            ))}
                        </Box>
                        }
                    />}
                </List>
            </CardContent>
        </Card>
        ))}
    </Box>
  );
}