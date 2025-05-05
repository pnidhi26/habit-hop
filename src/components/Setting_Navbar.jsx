import React from 'react';
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { List, ListItem, ListItemButton, ListItemText, Box } from '@mui/material';

export default function SettingNavbar() {
  return (
    <Box
      sx={{
        width: '240px',
        minWidth: '240px',
        backgroundColor: '#000000',
        color: 'white',
        height: '100%',
        paddingTop: '1rem',
      }}
    >
      <List>
        <CustomLink to="/settings/account" label="My Account" />
        <CustomLink to="/settings/switch" label="Switch Mode" />
        <CustomLink to="/settings/payment" label="Payment & Subscriptions" />
        <CustomLink to="/settings/faq" label="FAQ" />
        <CustomLink to="/settings/about" label="About" />
      </List>
    </Box>
  );
}

function CustomLink({ to, label }) {
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
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}
