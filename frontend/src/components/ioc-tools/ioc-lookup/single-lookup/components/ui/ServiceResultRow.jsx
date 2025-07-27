import React, { useState, useMemo } from "react";
import { TLP_COLORS } from "../../../shared/utils/tlpUtils"; 
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { TableRow, TableCell, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';

export default function ServiceResultRow({
  serviceKey, // Unique key for the row
  service,    // { name, icon, detailComponent }
  loading,
  result,     // Raw API result (or error object) for DetailComponent
  summary,    // Pre-calculated summary string
  tlp,        // Pre-calculated TLP string (e.g., 'RED', 'GREEN')
  ioc,
  iocType
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const displayConfig = useMemo(() => {
    const getCellBg = (tlpValue) => {
      if (tlpValue && TLP_COLORS[tlpValue]) {
        if (tlpValue === 'NONE' || (tlpValue === 'WHITE' && TLP_COLORS.WHITE === 'transparent')) {
            return 'transparent';
        }
        return TLP_COLORS[tlpValue];
      }
      return 'transparent'; 
    };
    
    return {
      tlpCellBackgroundColor: getCellBg(tlp),
    };
  }, [tlp, theme]);

  if (!service || !service.name) {
    return (
      <TableRow key={serviceKey || "service-config-error"}>
        <TableCell colSpan={4}>
          <Typography color="error">Error: Service details missing for row.</Typography>
        </TableCell>
      </TableRow>
    );
  }

  const baseCellStyle = { padding: "16px", verticalAlign: "middle" };
  const avatarStyle = { width: 30, height: 30, border: "1px solid", borderColor: theme.palette.divider };

  const getIconSrc = () => {
    try {
        if (!service.icon || service.icon === 'default_icon') { 
            return null; 
        }
        return require(`../../../shared/icons/${service.icon}.png`); 
    } catch (e) {
        return null; 
    }
  };
  const iconSrc = getIconSrc();

  const DetailComponentToRender = service.detailComponent; 

  const renderDetailsContent = () => {
    if (result?.error && !DetailComponentToRender) {
      let detailMessage = "No further details available for this error.";
      
      if (result.error === 429 && result.is_rate_limited) {
        detailMessage = (
          <Box>
            <Typography variant="body2" color="error" gutterBottom>
              <strong>Quota consumed. No API calls left.</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {result.message}
            </Typography>
            {result.retry_after && result.retry_after !== 'unknown' && (
              <Typography variant="body2" color="text.secondary">
                Retry after: {result.retry_after} seconds
              </Typography>
            )}
            {result.rate_limit_reset && result.rate_limit_reset !== 'unknown' && (
              <Typography variant="body2" color="text.secondary">
                Limit resets at: {result.rate_limit_reset}
              </Typography>
            )}
            {result.rate_limit_remaining && result.rate_limit_remaining !== 'unknown' && (
              <Typography variant="body2" color="text.secondary">
                Remaining requests: {result.rate_limit_remaining}
              </Typography>
            )}
          </Box>
        );
      } else if (result.message && result.error !== 404) {
        detailMessage = result.message;
      } else if (result.error === 404) {
        detailMessage = "The requested item was not found by the service.";
      } else if (result.error) {
        detailMessage = `An error (${result.error}) occurred.`;
      }
      
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          {typeof detailMessage === 'string' ? (
            <Typography variant="body2" color="text.secondary">{detailMessage}</Typography>
          ) : (
            detailMessage
          )}
        </Box>
      );
    }
    
    if (DetailComponentToRender) {
      return <DetailComponentToRender result={result} ioc={ioc} type={iocType} />;
    }

    if (!result || result.error) { 
        return <Box sx={{ p: 2, textAlign: 'center' }}><Typography variant="body2" color="text.secondary">No specific details component for this result.</Typography></Box>;
    }

    return (
      <Box sx={{ p: 2, overflowX: 'auto' }}>
        <Typography variant="caption" display="block" gutterBottom color="text.secondary">Raw JSON Data:</Typography>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '12px', backgroundColor: theme.palette.background.paper, padding: '10px', borderRadius: '4px', border: `1px solid ${theme.palette.divider}`, maxHeight: '400px', overflowY: 'auto' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </Box>
    );
  };

  if (loading) {
    return (
      <TableRow key={`${serviceKey}-loading`}>
        <TableCell style={baseCellStyle} sx={{width: '5%'}}>
          <IconButton aria-label="expand row" size="small" disabled><KeyboardArrowDownIcon /></IconButton>
        </TableCell>
        <TableCell style={baseCellStyle} sx={{width: '25%'}}>
          <CardHeader
            avatar={iconSrc ? <Avatar alt={`${service.name} icon`} src={iconSrc} sx={avatarStyle} variant="rounded" /> : <Avatar sx={avatarStyle} variant="rounded">{service.name.charAt(0).toUpperCase()}</Avatar>}
            titleTypographyProps={{ variant: 'body2', fontWeight: 'medium' }} title={service.name} sx={{ padding: 0 }}
          />
        </TableCell>
        <TableCell style={baseCellStyle} sx={{ width: '65%' }}>
          <CircularProgress size={20} sx={{ marginRight: 1, verticalAlign: 'middle' }} />
          <Typography variant="body2" component="span" sx={{ verticalAlign: 'middle' }}>{summary /* Show "Loading..." summary */}</Typography>
        </TableCell>
        <TableCell style={{ ...baseCellStyle, width: '5%', backgroundColor: displayConfig.tlpCellBackgroundColor, padding: 0 }}>&nbsp;</TableCell>
      </TableRow>
    );
  }

  const isExpandDisabled = !DetailComponentToRender && (!result || !!result.error);


  return (
    <>
      <TableRow hover key={`${serviceKey}-data`} sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell style={baseCellStyle} sx={{width: '5%'}}>
          <IconButton
            aria-label="expand row" size="small" onClick={() => setOpen(!open)}
            disabled={isExpandDisabled}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={baseCellStyle} sx={{width: '25%'}}>
          <CardHeader
            avatar={iconSrc ? <Avatar alt={`${service.name} icon`} src={iconSrc} sx={avatarStyle} variant="rounded" /> : <Avatar sx={avatarStyle} variant="rounded">{service.name.charAt(0).toUpperCase()}</Avatar>}
            titleTypographyProps={{ variant: 'body2', fontWeight: 'medium' }} title={service.name} sx={{ padding: 0 }}
          />
        </TableCell>
        <TableCell style={baseCellStyle} sx={{ width: '65%'}}>
          <Typography variant="body2" noWrap title={summary}>{summary}</Typography>
        </TableCell>
        <TableCell
          style={{ verticalAlign: 'middle', width: '5%', backgroundColor: displayConfig.tlpCellBackgroundColor, padding: 0, borderLeft: `1px solid ${theme.palette.divider}` }}
          title={`TLP: ${tlp}`}
        >
          &nbsp;
        </TableCell>
      </TableRow>
      <TableRow key={`${serviceKey}-details`}>
        <TableCell style={{ paddingBottom: open ? '16px' : 0, paddingTop: 0, paddingLeft: '56px', paddingRight: '16px', borderBottom: open ? `1px solid ${theme.palette.divider}` : 'none' }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, marginTop: 2, marginBottom: 2 }}>
                {renderDetailsContent()}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
