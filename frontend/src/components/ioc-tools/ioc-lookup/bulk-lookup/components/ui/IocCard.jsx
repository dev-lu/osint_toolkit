import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, Collapse, IconButton, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import ServiceRow from './ServiceRow';
import { TLP_COLORS } from '../../../shared/utils/tlpUtils';
import { SERVICE_DEFINITIONS } from '../../../shared/config/serviceConfig';

const StyledExpandMoreIcon = styled(ExpandMoreIcon, {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})(({ theme, isExpanded }) => ({
  transform: !isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function IocCard({ ioc, onToggleExpand }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(ioc.isCardExpanded || false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  const tlpColor = TLP_COLORS[ioc.overallTlp] || TLP_COLORS.WHITE;

  const cellStyle = {
    padding: "12px 16px",
    verticalAlign: "middle",
  };

  const avatarStyle = {
    width: 30,
    height: 30,
    border: "1px solid",
    borderColor: theme.palette.background.tableborder,
  };

  return (
    <Card sx={{ 
        mb: 1, 
        width: '100%', 
        borderLeft: `10px solid ${tlpColor}`,
        borderRadius: 1,
      }}>
      <CardHeader
        action={
          <IconButton onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <StyledExpandMoreIcon isExpanded={expanded}/>
          </IconButton>
        }
        title={
            <Typography variant="h6" component="div" sx={{ wordBreak: 'break-all' }}>
                {ioc.value}
            </Typography>
        }
        sx={{ '& .MuiCardHeader-content': { overflow: 'hidden' } }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          {Object.keys(ioc.services).length > 0 ? (
            <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
              <Table aria-label="service results">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      bgcolor: theme.palette.background.tablecell,
                      width: '40px'
                    }} />
                    <TableCell sx={{ 
                      bgcolor: theme.palette.background.tablecell,
                      fontWeight: "bold",
                    }}>
                      Service
                    </TableCell>
                    <TableCell sx={{ 
                      bgcolor: theme.palette.background.tablecell,
                      fontWeight: "bold",
                    }}>
                      Result
                    </TableCell>
                    <TableCell sx={{ 
                      bgcolor: theme.palette.background.tablecell,
                      width: '40px'
                    }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(ioc.services)
                    .filter(([serviceName]) => SERVICE_DEFINITIONS[serviceName])
                    .map(([serviceName, serviceData]) => (
                      <ServiceRow
                        key={serviceName}
                        serviceName={serviceName}
                        serviceData={serviceData}
                        iocValue={ioc.value}
                        iocType={ioc.type}
                        avatarStyle={avatarStyle}
                        cellStyle={cellStyle}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No services configured or results available for this IOC type.
            </Typography>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}
