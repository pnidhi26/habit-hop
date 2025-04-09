import React from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = '20%';

export default function Navbar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        height: '100vh',
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box', 
          backgroundColor: '#1a202c', 
          color: 'white',
          height: 'calc(100vh - 64px)',
          marginTop: '64px'
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <CustomLink to="/dashboard" label="Dashboard" icon={<DashboardIcon />} />
          <CustomLink to="/habits" label="Habits" icon={<AssignmentIcon />} />
          <CustomLink to="/plans" label="Plans" icon={<CalendarMonth />} />
          <CustomLink to="/analytics" label="Analytics" icon={<AnalyticsIcon />} />
          <CustomLink to="/community" label="Community" icon={<PeopleIcon />} />
          <CustomLink to="/settings" label="Settings" icon={<SettingsIcon />} />
        </List>
      </Box>
    </Drawer>
  )
}

function CustomLink({ to, label, icon }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        to={to}
        selected={isActive}
        sx={{
          color: isActive ? '#90caf9' : 'white',
          '&:hover': { backgroundColor: '#2d3748' }
        }}
      >
        {icon && <ListItemIcon sx={{ color: isActive ? '#90caf9' : 'white' }}>{icon}</ListItemIcon>}
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}
