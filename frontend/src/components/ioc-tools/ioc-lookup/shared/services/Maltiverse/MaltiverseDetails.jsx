import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent, 
  Grid,
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
  Paper, 
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web'; 
import SearchIcon from '@mui/icons-material/Search'; 
import ListAltIcon from '@mui/icons-material/ListAlt'; 

import GeneralInfo from '../../components/GeneralInfo';
import NoDetails from '../NoDetails'; 

const CharacteristicItem = ({ icon, primary, secondary }) => (
  <ListItem dense disableGutters>
    <ListItemIcon sx={{minWidth: 36}}>{icon}</ListItemIcon>
    <ListItemText 
      primary={primary} 
      secondary={typeof secondary === 'boolean' ? (secondary ? "Yes" : "No") : (secondary || "N/A")} 
      primaryTypographyProps={{ variant: 'body2' }}
      secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
    />
  </ListItem>
);


export default function MaltiverseDetails({ result, ioc }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  if (!result || result.error) {
    const message = result && result.error 
        ? `Error fetching Maltiverse details: ${result.message || result.error}` 
        : "Maltiverse details are unavailable or data is incomplete.";
    return (
      <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
        <NoDetails message={message} />
      </Box>
    );
  }
  if (!result.classification && !result.ip_addr) {
      return (
         <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 100 }}>
            <NoDetails message="Insufficient data from Maltiverse." />
        </Box>
      )
  }


  const transformedData = {
    ip: result.ip_addr || ioc,
    countryCode: result.country_code,
    city: result.city,
    isp: result.isp || result.as_name, 
    organization: result.organization, 
  };

  const blacklistEntries = Array.isArray(result.blacklist) ? result.blacklist : [];

  const ipCharacteristics = (
    <Card elevation={0} sx={{ flex: 1, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom component="div">
        Threat Profile & IP Characteristics
      </Typography>
      <List dense>
        <CharacteristicItem icon={<SecurityIcon color="action" />} primary="Classification" secondary={result.classification} />
        <CharacteristicItem icon={<VpnKeyIcon color="action" />} primary="VPN Node" secondary={result.is_vpn_node} />
        <CharacteristicItem icon={<VpnKeyIcon color="action" />} primary="Open Proxy" secondary={result.is_open_proxy} />
        <CharacteristicItem icon={<VpnKeyIcon color="action" />} primary="Tor Node" secondary={result.is_tor_node} />
        <CharacteristicItem icon={<NetworkCheckIcon color="action" />} primary="Command & Control (C&C)" secondary={result.is_cnc} />
        <CharacteristicItem icon={<NetworkCheckIcon color="action" />} primary="Distributing Malware" secondary={result.is_distributing_malware} />
        <CharacteristicItem icon={<StorageIcon color="action" />} primary="CDN Node" secondary={result.is_cdn} />
        <CharacteristicItem icon={<StorageIcon color="action" />} primary="Hosting Service" secondary={result.is_hosting} />
        <CharacteristicItem icon={<WebIcon color="action" />} primary="Web Server" secondary={result.is_web_server} />
        <CharacteristicItem icon={<WebIcon color="action" />} primary="Web Hosting" secondary={result.is_web_hosting} />
        <CharacteristicItem icon={<SearchIcon color="action" />} primary="Known Scanner" secondary={result.is_known_scanner} />
        <CharacteristicItem icon={<SearchIcon color="action" />} primary="Web Spider" secondary={result.is_web_spider} />
      </List>
    </Card>
  );

  const blacklistDetailsTable = blacklistEntries.length > 0 && (
    <Card elevation={0} sx={{ mt: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Grid container spacing={1} alignItems="center" mb={1}>
            <ListAltIcon color="action" />
            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                Blacklist Mentions ({blacklistEntries.length})
            </Typography>
        </Grid>
        <TableContainer component={Paper} elevation={0} sx={{border: '1px solid', borderColor: 'divider', borderRadius:1}}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{fontWeight:'bold', bgcolor:'background.paper'}}>Description</TableCell>
                <TableCell sx={{fontWeight:'bold', bgcolor:'background.paper'}}>First Seen</TableCell>
                <TableCell sx={{fontWeight:'bold', bgcolor:'background.paper'}}>Last Seen</TableCell>
                <TableCell sx={{fontWeight:'bold', bgcolor:'background.paper'}}>Source</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blacklistEntries
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((entry, index) => (
                  <TableRow hover key={`${entry.source}-${entry.first_seen}-${index}`}>
                    <TableCell sx={{wordBreak:'break-word'}}>{entry.description}</TableCell>
                    <TableCell>{entry.first_seen ? new Date(entry.first_seen).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{entry.last_seen ? new Date(entry.last_seen).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell sx={{wordBreak:'break-word'}}>{entry.source}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={blacklistEntries.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{borderTop: '1px solid', borderColor: 'divider', mt:0}}
        />
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ margin: 1, mt:0 }}> 
      <Grid container spacing={2} alignItems="stretch"> 
        <Grid item xs={12} md={5} sx={{ display: 'flex' }}>
          <Card elevation={0} sx={{ flex: 1, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom component="div">
              General IP Information
            </Typography>
            <GeneralInfo data={transformedData} />
          </Card>
        </Grid>
        <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
          {ipCharacteristics}
        </Grid>
      </Grid>
      {blacklistEntries.length > 0 && (
        <Box mt={2}> 
            {blacklistDetailsTable}
        </Box>
      )}
      {blacklistEntries.length === 0 && result.classification && ( 
         <Card elevation={0} sx={{ mt: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{textAlign:'center'}}>
                <ListAltIcon color="action" sx={{fontSize: 30, mb:1}}/>
                <Typography variant="body1" color="text.secondary">No blacklist entries found.</Typography>
            </CardContent>
         </Card>
      )}
    </Box>
  );
}
