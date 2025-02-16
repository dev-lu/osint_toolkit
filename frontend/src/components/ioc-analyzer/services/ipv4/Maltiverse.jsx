import React, { useEffect, useState } from 'react';
import {
  Card,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web';
import SearchIcon from '@mui/icons-material/Search';

import api from '../../../../api';
import GeneralInfo from './common/GeneralInfo';
import ResultRow from '../../ResultRow';

export default function Maltiverse({ ioc }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/ip/maltiverse/${ioc}`);
        setResult(response.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [ioc]);

  const transformedData = result ? {
    ip: result.ip_addr,
    country: result.country,
    countryCode: result.country_code,
    city: result.city,
    organisation: result.registrant_name,
    asn: {
      asn: result.as_name,
      asnCidr: result.asn_cidr,
      asnCountryCode: result.asn_country_code,
      asnDate: result.asn_date,
      asnRegistry: result.asn_registry,
    }
  } : {};

  const details = result && (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      gap: 1 
    }}>
      <Box sx={{ flex: { xs: '1', md: '1' } }}>
        <GeneralInfo
          data={transformedData}
          loading={loading}
          error={error}
        />
      </Box>
      
      <Card sx={{ 
        flex: { xs: '1', md: '1' },
        p: 1, 
        borderRadius: 1
      }}>
        <Typography variant="subtitle2" color="textSecondary" sx={{ pl: 2, pb: 0.5 }}>
          Threat Information
        </Typography>
        <List disablePadding>
          <ListItem dense>
            <ListItemIcon>
              <SecurityIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Classification" secondary={result.classification} />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <VpnKeyIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="VPN" 
              secondary={`${result.is_vpn_node ? "Yes" : "No"}`} 
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <VpnKeyIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Proxy" 
              secondary={`${result.is_open_proxy ? "Yes" : "No"}`} 
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <VpnKeyIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Tor Node" 
              secondary={`${result.is_tor_node ? "Yes" : "No"}`} 
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <NetworkCheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Command & Control" 
              secondary={`${result.is_cnc ? "Yes" : "No"}`} 
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <NetworkCheckIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Malware Distribution" 
              secondary={`${result.is_distributing_malware ? "Yes" : "No"}`} 
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <StorageIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="CDN" 
              secondary={`${result.is_cdn ? "Yes" : "No"}`} 
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <StorageIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Hosting" 
              secondary={`${result.is_hosting ? "Yes" : "No"}`} 
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <WebIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Web Server" 
              secondary={`${result.is_web_server ? "Yes" : "No"}`} 
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <WebIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Web Hosting" 
              secondary={`${result.is_web_hosting ? "Yes" : "No"}`} 
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <SearchIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Known Scanner" 
              secondary={`${result.is_known_scanner ? "Yes" : "No"}`} 
            />
          </ListItem>
          <ListItem dense>
            <ListItemIcon>
              <SearchIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Web Spider" 
              secondary={`${result.is_web_spider ? "Yes" : "No"}`} 
            />
          </ListItem>
        </List>
      </Card>
    </Box>
  );

  const blacklistDetails = result?.blacklist?.length > 0 && (
    <Card sx={{ borderRadius: 1, mt: 1 }}>
      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle2" color="textSecondary" sx={{ pl: 1, pb: 0.5 }}>
          Blacklist Entries
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>First Seen</TableCell>
                <TableCell>Last Seen</TableCell>
                <TableCell>Source</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.blacklist
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.first_seen}</TableCell>
                    <TableCell>{entry.last_seen}</TableCell>
                    <TableCell>{entry.source}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={result.blacklist.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      </Box>
    </Card>
  );

  return (
    <ResultRow
      name="Maltiverse"
      id="maltiverse"
      icon="maltiverse_logo_small"
      loading={loading}
      result={result}
      summary={result?.classification ? 
        result.classification.charAt(0).toUpperCase() + result.classification.slice(1) : 
        null}
      color={result?.classification === "malicious" ? "red" : 
             result?.classification === "suspicious" ? "orange" : 
             "green"}
      error={error}
      details={
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {details}
          {blacklistDetails}
        </Box>
      }
    />
  );
}