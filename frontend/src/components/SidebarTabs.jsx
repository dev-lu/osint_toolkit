import React, { useState, useEffect } from "react";
import { 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Box,
  Collapse
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function SidebarTabs({ title, tabs }) {
  const location = useLocation();
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    const newOpenItems = {};
    tabs.forEach(tab => {
      if (tab.children) {
        const isChildActive = tab.children.some(child => location.pathname === child.path);
        if (isChildActive) {
          newOpenItems[tab.label] = true;
        }
      }
    });
    setOpenItems(newOpenItems);
  }, [location.pathname, tabs]);

  const handleClick = (label) => {
    setOpenItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const renderTab = (tab, depth = 0) => {
    const isActive = location.pathname === tab.path;
    const hasChildren = tab.children && tab.children.length > 0;
    const isOpen = openItems[tab.label];

    return (
      <React.Fragment key={tab.path}>
        <ListItemButton
          component={Link}
          to={tab.path}
          onClick={hasChildren ? (e) => {
            e.preventDefault();
            handleClick(tab.label);
          } : undefined}
          selected={isActive}
          sx={{
            borderRadius: 1,
            mb: 0.5,
            pl: 2,
            bgcolor: isActive ? 'primary.main' : 'transparent',
            color: isActive ? 'primary.contrastText' : 'text.primary',
            '&:hover': {
              bgcolor: isActive ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            {tab.icon}
          </ListItemIcon>
          <ListItemText primary={tab.label} />
          {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {tab.children.map(child => (
                <ListItemButton
                  key={child.path}
                  component={Link}
                  to={child.path}
                  selected={location.pathname === child.path}
                  sx={{
                    pl: 4.5,
                    py: 0.5,
                    borderRadius: 0,
                    bgcolor: 'transparent',
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                    ml: 3,
                    '&.Mui-selected': {
                      bgcolor: 'transparent',
                      color: 'primary.main',
                      borderColor: 'primary.main',
                    },
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: 'primary.main',
                    },
                    fontSize: '0.875rem',
                  }}
                >
                  <ListItemText 
                    primary={child.label} 
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: location.pathname === child.path ? 500 : 400,
                    }}
                    sx={{ m: 0 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <List>
        {tabs.map(tab => renderTab(tab))}
      </List>
    </Box>
  );
}

SidebarTabs.propTypes = {
  title: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};