import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Avatar,
  CardHeader,
  CircularProgress
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import useTheme from '@mui/material/styles/useTheme';
import { TLP_COLORS } from '../../../shared/utils/tlpUtils';
import { SERVICE_DEFINITIONS } from '../../../shared/config/serviceConfig';

export default function ServiceRow({
  serviceName,
  serviceData,
  iocValue,
  iocType,
  avatarStyle: propAvatarStyle,
  cellStyle: propCellStyle
}) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const config = SERVICE_DEFINITIONS[serviceName];
  const DetailComponent = config ? config.detailComponent : null;

  const baseCellStyle = propCellStyle || { padding: "12px 16px", verticalAlign: "middle" };
  const avatarStyle = propAvatarStyle || {
    width: 30,
    height: 30,
    border: "1px solid",
    borderColor: theme.palette.divider,
  };

  const getIconSrc = () => {
    if (!config || !config.icon) {
      try { return require(`../../../shared/icons/default_icon.png`); }
      catch (e) { return null; }
    }
    try {
      return require(`../../../shared/icons/${config.icon}.png`);
    } catch (e) {
      try {
        return require(`../../../shared/icons/default_icon.png`);
      } catch (e2) {
        return null;
      }
    }
  };
  const iconSrc = getIconSrc();


  const getTlpCellBackgroundColor = () => {
    const currentTlp = serviceData.tlp;
    if (serviceData.status === 'loading') return 'transparent';
    if (serviceData.status === 'error') {
      return theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.action.disabledBackground;
    }
    if (currentTlp && TLP_COLORS[currentTlp]) {
      if (currentTlp === 'WHITE' || currentTlp === 'NONE') {
        return 'transparent';
      }
      return TLP_COLORS[currentTlp];
    }
    return 'transparent';
  };
  const tlpCellBgColor = getTlpCellBackgroundColor();

  if (serviceData.status === 'loading') {
    return (
      <TableRow>
        <TableCell style={baseCellStyle} sx={{width: '40px'}}>
          <IconButton aria-label="expand row" size="small" disabled>
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>
        <TableCell style={baseCellStyle}>
          <CardHeader
            avatar={iconSrc ? <Avatar alt={`${config?.name || serviceName} icon`} src={iconSrc} sx={avatarStyle} variant="rounded"/> : <Avatar sx={avatarStyle} variant="rounded">{(config?.name || serviceName).charAt(0)}</Avatar>}
            title={config?.name || serviceName}
            sx={{ padding: 0 }}
            titleTypographyProps={{ variant: 'body2' }}
          />
        </TableCell>
        <TableCell style={baseCellStyle}>
          <CircularProgress size={20} />
        </TableCell>
        <TableCell style={{ ...baseCellStyle, width: '40px', backgroundColor: 'transparent', padding: 0 }} />
      </TableRow>
    );
  }

  if (serviceData.status === 'error') {
     return (
      <TableRow>
        <TableCell style={baseCellStyle} sx={{width: '40px'}}>
          <IconButton aria-label="expand row" size="small" disabled>
            <KeyboardArrowDownIcon />
          </IconButton>
        </TableCell>
        <TableCell style={baseCellStyle}>
          <CardHeader
            avatar={iconSrc ? <Avatar alt={`${config?.name || serviceName} icon`} src={iconSrc} sx={avatarStyle} variant="rounded"/> : <Avatar sx={avatarStyle} variant="rounded">{(config?.name || serviceName).charAt(0)}</Avatar>}
            title={config?.name || serviceName}
            sx={{ padding: 0 }}
            titleTypographyProps={{ variant: 'body2' }}
          />
        </TableCell>
        <TableCell style={baseCellStyle}>
          <Typography variant="body2" color="error" noWrap title={serviceData.summary}>
            {serviceData.summary}
          </Typography>
        </TableCell>
        <TableCell style={{...baseCellStyle, width: '40px', backgroundColor: tlpCellBgColor, padding: 0}} />
      </TableRow>
    );
  }

  return (
    <>
      <TableRow hover>
        <TableCell style={baseCellStyle} sx={{width: '40px'}}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            disabled={!serviceData.data || !DetailComponent}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={baseCellStyle}>
          <CardHeader
            avatar={iconSrc ? <Avatar alt={`${config?.name || serviceName} icon`} src={iconSrc} sx={avatarStyle} variant="rounded"/> : <Avatar sx={avatarStyle} variant="rounded">{(config?.name || serviceName).charAt(0)}</Avatar>}
            title={config?.name || serviceName}
            sx={{ padding: 0 }}
            titleTypographyProps={{ variant: 'body2' }}
          />
        </TableCell>
        <TableCell style={baseCellStyle}>
          <Typography variant="body2" noWrap title={serviceData.summary}>
            {serviceData.summary || 'No summary'}
          </Typography>
        </TableCell>
        <TableCell
          style={{
            verticalAlign: 'middle',
            width: '40px',
            backgroundColor: tlpCellBgColor,
            padding: 0,
            borderLeft: `1px solid ${theme.palette.divider}`,
          }}
          title={`TLP: ${serviceData.tlp || 'N/A'}`}
        >
          &nbsp;
        </TableCell>
      </TableRow>

      {DetailComponent && serviceData.data && (
        <TableRow>
          <TableCell
            style={{
              paddingBottom: open ? '16px' : 0,
              paddingTop: 0,
              paddingLeft: '56px',
              paddingRight: '16px',
              borderBottom: open ? `1px solid ${theme.palette.divider}` : 'none',
            }}
            colSpan={4}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1, mt:2, mb:2 }}>
                <DetailComponent
                  result={serviceData.data}
                  ioc={iocValue}
                  type={iocType}
                />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
