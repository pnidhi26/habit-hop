import React, { useEffect, useState } from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import defaultIconSettings from '../data/switch_icon';
const drawerWidth = '20%';


const iconMap = {
  dashboard: <DashboardIcon />,
  habits: <AssignmentIcon />,
  plans: <CalendarMonth />,
  analytics: <AnalyticsIcon />,
  community: <PeopleIcon />,
  settings: <SettingsIcon />
};

const labelMap = {
  dashboard: 'Dashboard',
  habits: 'Habits',
  plans: 'Plans',
  analytics: 'Analytics',
  community: 'Community',
  settings: 'Settings'
};



export default function Navbar() {
  const [iconSettings, setIconSettings] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('iconSettings');
    if (stored) {
      setIconSettings(JSON.parse(stored));
    } else {
      setIconSettings(defaultIconSettings);
    }
  }, []);

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
          backgroundColor: '#000000',
          color: 'white',
          height: 'calc(100vh - 64px)',
          marginTop: '72px'
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {iconSettings
            .filter(item => item.visible)
            .map(item => (
              <CustomLink
                key={item.key}
                to={`/${item.key}`}
                label={labelMap[item.key]}
                icon={iconMap[item.key]}
              />
            ))}
        </List>
      </Box>
    </Drawer>
  );
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
          color: isActive ? '#A855F7' : 'white',
          '&:hover': { backgroundColor: '#A855F7' }
        }}
      >
        {icon && <ListItemIcon sx={{ color: isActive ? '#A855F7' : 'white' }}>{icon}</ListItemIcon>}
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}

